import { TRICKS as G } from '../RRB_Graduate/tricks.js'

const t = (id, topic, title, how, q, a) => ({ id, sub: 'Typing', topic, title, how, q, a })

// Maths and Reasoning shortcuts are shared with Graduate; the Typing tricks are Undergraduate-only.
const TYPING = [
  t('t0', 'Technique', 'Home row anchor', 'Rest your index fingers on F and J, where the keys have small bumps. Every other finger covers its own column, so you can reach any key without looking.', 'Which fingers rest on the keys with bumps?', 'The two index fingers, on F and J. The other fingers rest on D, S, A and K, L, ; beside them.'),
  t('t1', 'Technique', 'Shift and space', 'Hold Shift with the little finger of the hand opposite to the letter you want to capitalise. Use one thumb, always the same one, for the space bar.', 'To type a capital T, which hand holds Shift?', 'The right hand little finger. T is typed with the left hand.'),
  t('t2', 'Speed', 'Work out your speed', 'Gross WPM = (keystrokes ÷ 5) ÷ minutes. Net WPM = gross − errors per minute.', 'You type 900 keystrokes in 6 minutes with 3 uncorrected errors. Net speed?', 'Gross: 900 ÷ 5 = 180 words, in 6 min = 30 wpm. Errors per minute = 3 ÷ 6 = 0.5. Net = 29.5 wpm.'),
  t('t3', 'Speed', 'Accuracy before speed', 'Build to 95% accuracy at a comfortable pace, then raise the pace. Errors cost more time than slow, steady typing.', 'Two typists: A does 32 wpm with 10 errors in 5 min, B does 28 wpm with 0 errors. Who has the better net speed?', 'A: 32 − 10/5 = 30 wpm. B: 28 wpm. A is slightly ahead here, but one more error per minute reverses it. Aim for both.'),
  t('t4', 'Technique', 'Do not look down', 'Keep your eyes on the screen or the passage. Looking at the keys breaks your rhythm and makes you slower and less accurate.', 'What is the fastest fix if you keep glancing at the keyboard?', 'Cover the keys, or practise on the home row drills until each reach is automatic.'),
  t('t5', 'Hindi', 'Inscript layout', 'In the Inscript layout, vowels and matras sit under the left hand and consonants under the right. Learn the home row first, then add matras.', 'Which hand mostly types consonants in Inscript?', 'The right hand.'),
  t('t6', 'Test day', 'Proofread the last 15 seconds', 'Keep your pace through the passage. In the last 15 seconds scan the final lines for obvious errors instead of starting a new line you cannot finish. Follow the backspace rules in the test.', 'You have 15 seconds left and an error two lines up. What do you do?', 'If the test allows corrections, fix it when you can without losing your place; do not rush a new line.'),
  t('t7', 'Practice plan', 'Short sessions win', 'Three 20-minute sessions a day beat one 60-minute session. Tired fingers form bad habits.', 'You have an hour a day. How should you split it?', 'Three 20-minute blocks: two on speed and accuracy drills, one on a timed passage.'),
]
export const TRICKS = [...G, ...TYPING]
