-- Mission 90: Supabase schema. Paste this whole file into Supabase > SQL Editor and run it once.
-- Safe to run again: every statement is idempotent.

-- 1. Each person's saved progress, one row per exam. Only the owner can read or write it.
create table if not exists public.progress (
  user_id    uuid not null references auth.users (id) on delete cascade,
  exam       text not null check (exam in ('graduate', 'undergraduate', 'groupd')),
  data       jsonb not null,
  client_t   bigint not null default 0,          -- the app's own "last changed" time, used to pick the newer copy
  updated_at timestamptz not null default now(),
  primary key (user_id, exam)
);

-- 2. A small public-to-your-groups summary used for leaderboards. No notes, errors or answers are stored here.
create table if not exists public.summaries (
  user_id        uuid not null references auth.users (id) on delete cascade,
  exam           text not null check (exam in ('graduate', 'undergraduate', 'groupd')),
  nickname       text not null default 'Learner' check (char_length(nickname) between 1 and 24),
  xp             int  not null default 0,
  streak         int  not null default 0,
  tasks_pct      int  not null default 0,
  topics_learned int  not null default 0,
  best_mock      numeric,
  updated_at     timestamptz not null default now(),
  primary key (user_id, exam)
);

-- 3. Study groups, joined with a short invite code.
create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 2 and 40),
  code       text not null unique,
  owner      uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id  uuid not null references public.groups (id) on delete cascade,
  user_id   uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- Helper used by the access rules. SECURITY DEFINER avoids a rules-calling-rules loop.
create or replace function public.is_member(gid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_members where group_id = gid and user_id = auth.uid())
$$;

-- Access rules: nobody can read another person's progress or summary directly.
alter table public.progress      enable row level security;
alter table public.summaries     enable row level security;
alter table public.groups        enable row level security;
alter table public.group_members enable row level security;

drop policy if exists "own progress"   on public.progress;
drop policy if exists "own summary"    on public.summaries;
drop policy if exists "see my groups"  on public.groups;
drop policy if exists "owner renames"  on public.groups;
drop policy if exists "owner deletes"  on public.groups;
drop policy if exists "see group mates" on public.group_members;
drop policy if exists "leave a group"  on public.group_members;

create policy "own progress"    on public.progress  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own summary"     on public.summaries for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "see my groups"   on public.groups for select to authenticated using (public.is_member(id));
create policy "owner renames"   on public.groups for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
create policy "owner deletes"   on public.groups for delete to authenticated using (owner = auth.uid());
create policy "see group mates" on public.group_members for select to authenticated using (user_id = auth.uid() or public.is_member(group_id));
create policy "leave a group"   on public.group_members for delete to authenticated using (user_id = auth.uid());

-- Group actions go through functions so the rules above can stay strict.
create or replace function public.create_group(p_name text)
returns table (id uuid, name text, code text)
language plpgsql security definer set search_path = public as $$
declare v_code text; v_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if (select count(*) from public.groups g where g.owner = auth.uid()) >= 5 then
    raise exception 'You can own up to 5 groups';
  end if;
  loop
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.groups g where g.code = v_code);
  end loop;
  insert into public.groups (name, code, owner) values (trim(p_name), v_code, auth.uid()) returning groups.id into v_id;
  insert into public.group_members (group_id, user_id) values (v_id, auth.uid());
  return query select g.id, g.name, g.code from public.groups g where g.id = v_id;
end $$;

create or replace function public.join_group(p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  select g.id into v_id from public.groups g where g.code = upper(trim(p_code));
  if v_id is null then raise exception 'No group with that code'; end if;
  if (select count(*) from public.group_members m where m.group_id = v_id) >= 50 then
    raise exception 'That group is full (50 people)';
  end if;
  insert into public.group_members (group_id, user_id) values (v_id, auth.uid()) on conflict do nothing;
  return v_id;
end $$;

create or replace function public.leave_group(p_group uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.group_members where group_id = p_group and user_id = auth.uid();
  if not exists (select 1 from public.group_members where group_id = p_group) then
    delete from public.groups where id = p_group;
  end if;
end $$;

-- The leaderboard: members of a group see each other's summary for one exam, nothing else.
create or replace function public.group_leaderboard(p_group uuid, p_exam text)
returns table (user_id uuid, nickname text, xp int, streak int, tasks_pct int, topics_learned int, best_mock numeric, updated_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_member(p_group) then raise exception 'Not a member of this group'; end if;
  return query
    select m.user_id,
           coalesce(s.nickname, (select x.nickname from public.summaries x where x.user_id = m.user_id limit 1), 'Learner'),
           coalesce(s.xp, 0), coalesce(s.streak, 0), coalesce(s.tasks_pct, 0), coalesce(s.topics_learned, 0), s.best_mock, s.updated_at
    from public.group_members m
    left join public.summaries s on s.user_id = m.user_id and s.exam = p_exam
    where m.group_id = p_group
    order by coalesce(s.xp, 0) desc, m.joined_at asc;
end $$;

-- Lets a person erase everything the app stored about them.
create or replace function public.delete_my_data()
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.progress  where user_id = auth.uid();
  delete from public.summaries where user_id = auth.uid();
  delete from public.group_members where user_id = auth.uid();
  delete from public.groups g where g.owner = auth.uid() and not exists (select 1 from public.group_members m where m.group_id = g.id);
end $$;

-- Only signed-in people may call these.
revoke all on function public.create_group(text), public.join_group(text), public.leave_group(uuid),
  public.group_leaderboard(uuid, text), public.delete_my_data(), public.is_member(uuid) from public, anon;
grant execute on function public.create_group(text), public.join_group(text), public.leave_group(uuid),
  public.group_leaderboard(uuid, text), public.delete_my_data(), public.is_member(uuid) to authenticated;
