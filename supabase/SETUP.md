# Connect Mission 90 to Supabase

This turns on sign-in, cloud saving across devices, and study groups with leaderboards. It takes about ten minutes. Everything is free at this size.

Until you finish, the site keeps working exactly as before, saving progress in each browser.

## 1. Create the project
1. Go to https://supabase.com, sign in, and choose **New project**.
2. Pick any name and region, and set a database password (keep it somewhere safe; the site never needs it).

## 2. Create the tables and rules
1. Open **SQL Editor → New query**.
2. Paste the whole of `supabase/schema.sql` and press **Run**. You can run it again later without harm.

This creates the tables and access rules. Nobody can read another person's saved progress. Group members can only see each other's leaderboard numbers.

## 3. Allow sign-in
1. **Authentication → Providers**: Email is on by default (people get a sign-in link by email). Turn off "Confirm email" only if you want to skip it; the link flow works either way.
2. **Authentication → URL Configuration**:
   - Site URL: `https://vp171097.github.io/RRB/`
   - Redirect URLs: add `https://vp171097.github.io/RRB/` and `http://localhost:5173/` (for running it on your computer).
3. Optional, Google sign-in: **Authentication → Providers → Google**, paste a Client ID and secret from Google Cloud Console (OAuth client of type Web, with the callback URL Supabase shows you).

Heads up: Supabase's built-in email sender allows only a few emails an hour. For a real group, either enable Google sign-in or add a custom SMTP service under **Authentication → SMTP Settings**.

### Sign in with a password
The site offers **Sign in / Create account** with email and password, plus a "forgot password" link and an email-link option.

By default Supabase asks every new person to confirm their email before they can sign in, and its built-in email sender is limited to a few messages an hour. For a small private group, the simplest setup is:

- **Authentication → Providers → Email → turn off "Confirm email".** New accounts then work straight away, with no email needed.
- Leave "Secure password change" and the minimum length at their defaults. The site asks for at least 8 characters.

Trade-off: with confirmation off, nobody checks that an email address is really theirs. That is fine for friends sharing a group code. If you want verified emails, keep confirmation on and add a custom SMTP service under **Authentication → SMTP Settings**.

Password resets always need email, so they also depend on the email limit above.

### Sign in with a phone number
The site also accepts a phone number plus password (a 10-digit number is read as +91). This uses Supabase's phone sign-in, which is off by default:

- **Authentication → Providers → Phone → enable it**, and turn **off** "Enable phone confirmations" so no SMS is needed. Supabase may ask you to pick an SMS provider; you can leave it unset when confirmations are off, but if the dashboard insists, phone sign-in needs a paid SMS service (for example Twilio), and email sign-in is the free route.
- Without confirmation, nobody proves a number is theirs, and a phone account cannot reset its password. Use it for a small private group, and tell people to also keep their email on their account.

## 4. Connect the site
1. **Project Settings → API**. Copy the **Project URL** and the **anon public** key.
2. Put them in `app/src/cloud-config.js`:
   ```js
   export const SUPABASE_URL = 'https://xxxx.supabase.co'
   export const SUPABASE_ANON_KEY = 'eyJ...'
   ```
3. Commit and push to `main`. The site redeploys with the **Track → Group** page switched on.

The anon key is meant to be public, because the rules in `schema.sql` protect the data. Never paste the `service_role` key anywhere in this repository.

## 5. Try it
1. Open the site, go to **Track → Group**, and sign in with your email. Open the link from your email in the same browser.
2. A small dot appears next to the title: green means your progress is saved to your account.
3. Create a group, copy its invite code and send it to a friend. They sign in, enter the code under **Create or join**, and you both see each other on the leaderboard.

## How it behaves
- The newer copy wins. When you sign in on a new device, your cloud progress loads. If your device had different progress, it is kept as a local copy you can restore from the Group page.
- Leaderboards show one exam at a time: whichever exam is selected at the top.
- **Delete my cloud data** on the Group page erases the saved progress, leaderboard rows and group memberships. Your account email stays in Supabase until you delete the user under Authentication → Users.
- Limits set in `schema.sql`: 50 people per group and 5 groups owned per person. Change them there if you need.
