// Ticking the last sub-topic completes its main task; unticking one after that reopens it.
export function toggleSub(s, X, n, i, j, on) {
  const task = X.DAYS[n - 1].tasks[i]
  const all = () => task.subs.every((_, jj) => s.subdone[`${n}.${i}.${jj}`])
  const before = all()
  const k = `${n}.${i}.${j}`
  if (on) s.subdone[k] = 1; else delete s.subdone[k]
  if (all()) s.done[`${n}.${i}`] = 1
  else if (before) delete s.done[`${n}.${i}`]
}
