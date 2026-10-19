export default `
## Number series :: Difference series
Find the gap between neighbouring terms. If the gaps are not constant, take the gaps of the gaps.
- Constant gap: arithmetic series. Gaps that grow by a fixed step: second-order series.
Q: 2, 5, 10, 17, 26, ?
A: Gaps 3, 5, 7, 9, so the next gap is 11. Answer 37.

## Number series :: Square and cube patterns
- Squares: 1, 4, 9, 16, 25, 36, 49. Cubes: 1, 8, 27, 64, 125, 216.
- Look for n^2 +/- k and n^3 +/- k: 3, 8, 15, 24 is n^2 - 1.
Q: 3, 8, 15, 24, 35, ?
A: n^2 - 1 with n = 7: 48.

## Number series :: Multiply-add patterns
- Each term = previous x a + b. Try x2 + 1, x2 - 1, x3 + 2 and so on.
Q: 7, 15, 31, 63, ?
A: Each is double plus 1: 127.

## Number series :: Alternating and mixed series
- Split into odd-position and even-position terms and check each separately.
- Mixed operations: add, then multiply, then add.
Q: 2, 10, 4, 20, 6, 30, ?
A: Odd terms 2, 4, 6, 8; even terms 10, 20, 30. The next term is 8.

## Number series :: Wrong number
- Find the rule from the terms that fit, then spot the one that breaks it.
Q: 3, 7, 15, 31, 64, 127. Wrong term?
A: Rule x2 + 1: 31 x 2 + 1 = 63, so 64 is wrong.

## Alphabet series :: Letter positions
- A = 1 ... Z = 26. Convert letters to numbers, find the pattern, convert back.
- Anchor letters: E = 5, J = 10, O = 15, T = 20, Y = 25.
Q: B, E, H, K, ?
A: +3 each: N.

## Alphabet series :: Opposite letters
- The opposite of a letter in position n is 27 - n. A pairs with Z, B with Y, G with T.
Q: Opposite of G?
A: 27 - 7 = 20, which is T.

## Alphabet series :: Skip patterns
- Look for letters skipped at a steady gap, or a gap that grows by one each time.
Q: A, C, F, J, ?
A: Gaps 2, 3, 4, so the next gap is 5: O.

## Alphabet series :: Group series
- For groups like ABC, DEF, look at the first letter of each group and the pattern within the group.
Q: AB, CD, EF, ?
A: GH.

## Alphabet series :: Missing letters
- Find the repeating block of letters, then test each option so that the series repeats evenly.

## Analogy :: Word analogies
- Make a sentence from the first pair, then use the same sentence on the second pair.
- Common relations: tool and user, part and whole, cause and effect, category and member.
Q: Doctor : Hospital :: Teacher : ?
A: School.

## Analogy :: Number analogies
- Test n^2, n^3, n +/- k, multiplication and digit-sum links.
Q: 5 : 125 :: 6 : ?
A: Cube of the number: 216.

## Analogy :: Letter analogies
- Compare position changes: shifts, reversals, skips.
Q: ACE : BDF :: GIK : ?
A: Each letter moves +1: HJL.

## Analogy :: Relation types
- Part to whole, object to material, profession to workplace, animal to young, symbol to meaning. Stay consistent in order: first-to-second must match third-to-fourth.

## Classification (odd one out) :: Words
- Find the category shared by three; the odd one belongs to a different class.
Q: Mango, Apple, Potato, Banana.
A: Potato is a vegetable; the others are fruits.

## Classification (odd one out) :: Numbers
- Test prime, square, cube, multiple, digit sum and parity.
Q: 9, 16, 25, 30, 49.
A: 30 is not a perfect square.

## Classification (odd one out) :: Letters
- Compare position gaps, vowels or consonants, and reverse pairs.
Q: AC, EG, IK, MP.
A: MP breaks the +2 gap: A-C, E-G, I-K have a gap of 2, M-P has 3.

## Classification (odd one out) :: Property-based grouping
- Look beyond the obvious: shape, use, origin, count of letters, alphabetical order.

## Coding-Decoding I :: Letter shifting
- Write the word and its code with positions underneath; find the constant or changing shift.
Q: CAT is coded as ECV. Code DOG.
A: +2 each: FQI.

## Coding-Decoding I :: Reverse alphabet codes
- A to Z, B to Y, and so on: the code is 27 minus the position.
Q: Code of CAT in reverse alphabet?
A: XZG.

## Coding-Decoding I :: Position-sum codes
- Add the positions of the letters to get the code number.
Q: If A = 1, B = 2, ..., what is the code of CAB?
A: 3 + 1 + 2 = 6.

## Coding-Decoding I :: Word to word codes
- Replace each word by its code. Use shared words across statements to match words to codes.
Q: "tea is hot" = 3 5 7, "hot day" = 7 9, "tea day" = 3 9. Code for "is"?
A: hot = 7, tea = 3, so is = 5.

## Coding-Decoding II :: Number codes
- Break the number into pieces and match each piece to a letter or word using two statements.
- Look for the common digit in two codes that share one word.

## Coding-Decoding II :: Symbol codes
- Build a legend of symbols from the examples, then decode the target.

## Coding-Decoding II :: Substitution
- Replace the named items first (for example "call blue as red"), then answer using the new names.
Q: If sky is called sea, sea is called road and road is called wall, what is a ship sailing on?
A: A ship sails on the sea, which is called road.

## Coding-Decoding II :: Conditional coding
- Apply the rule for each condition in the given order; write intermediate steps.

## Blood Relations :: Family tree method
- Draw a tree: + for male, - for female. Horizontal lines for spouses, vertical for children.
- Key terms: mother's brother is maternal uncle, father's sister is paternal aunt, brother's wife is sister-in-law.
Q: A is B's father. C is A's mother. How is C related to B?
A: Paternal grandmother.

## Blood Relations :: Coded relations
- A symbol stands for a relation (for example A + B means A is B's father). Translate step by step.
Q: P + Q means P is Q's mother. Q - R means Q is R's brother. How is P related to R?
A: P is the mother of Q, and Q is R's brother, so P is R's mother.

## Blood Relations :: Generation count
- Parents are one generation up; grandparents two. Siblings are the same generation.
Q: A is B's mother's father. Relation?
A: Maternal grandfather.

## Blood Relations :: Pointing-to-person problems
- "My mother's only brother's son" is a cousin. Trace each link one step at a time.
Q: Pointing to a man, Riya says "He is the son of my mother's only brother." Relation?
A: Cousin.

## Direction & Distance :: Compass directions
- North, East, South, West run clockwise. North-East lies between North and East.
- Draw every move on paper starting from a dot.

## Direction & Distance :: Left and right turns
- Facing North: right is East, left is West. Rotate your reference with each turn.
Q: Facing North, turn right, then left. Now facing?
A: East, then North.

## Direction & Distance :: Shortest distance by Pythagoras
- After moves in perpendicular directions, the straight-line distance is the hypotenuse.
Q: 3 km north, then 4 km east. Distance from the start?
A: 5 km.

## Direction & Distance :: Shadow questions
- In the morning the sun rises in the East, so shadows fall to the West. In the evening shadows fall to the East.
Q: At sunrise a man's shadow falls on his right. He faces?
A: Shadow to the West on his right means he faces South.

## Ranking & Order :: Rank from left and right
- Position from the other end = total - given position + 1.
Q: 12th from the top in a class of 40. Rank from the bottom?
A: 29.

## Ranking & Order :: Total = left + right - 1
- If you know a person's rank from both ends: total = left + right - 1.
Q: Rahul is 12th from top and 28th from bottom.
A: 39 in all.

## Ranking & Order :: Persons between
- Between two ranks in the same order: difference - 1.
Q: A is 7th from left and B is 12th from left. Between them?
A: 4.

## Ranking & Order :: Position changes
- When two people swap places, use the new ranks to find the total or the gap.
Q: A is 10th from left. After swapping with B, A is 15th. What was B's position?
A: 15th.

## Mathematical Operations :: Symbol replacement
- Replace each symbol with its real operation first. Then apply BODMAS.
Q: + means x, - means divide, x means -, divide means +. Find 8 + 3 - 6 x 2 divide 5.
A: 8 x 3 / 6 - 2 + 5 = 7.

## Mathematical Operations :: Interchange of signs
- Swap the two named signs everywhere, then solve normally.
Q: Swap + and x: 6 + 4 x 3.
A: 6 x 4 + 3 = 27.

## Mathematical Operations :: Interchange of numbers
- Swap the named numbers wherever they appear.
Q: Swap 2 and 5 in 2 x 5 + 5 - 2.
A: 5 x 2 + 2 - 5 = 7.

## Mathematical Operations :: BODMAS with new symbols
- After conversion, brackets first, then orders, division and multiplication, then addition and subtraction.

## Calendar & Clock :: Odd days
- Ordinary year: 1 odd day. Leap year: 2. 100 years: 5 odd days. 200: 3. 300: 1. 400: 0.
- Day code: Sunday 0, Monday 1 ... Saturday 6.

## Calendar & Clock :: Day of the week
- Day after N days: shift by N mod 7.
Q: Today is Monday. Day after 100 days?
A: 100 mod 7 = 2, so Wednesday.

## Calendar & Clock :: Leap years
- A year is a leap year if divisible by 4. Century years must be divisible by 400.
- February has 29 days in a leap year.
Q: Is 1900 a leap year?
A: No, it is not divisible by 400.

## Calendar & Clock :: Clock angles
- Angle between hands = |30H - 5.5M|. Take the smaller angle if above 180.
Q: Angle at 4:30?
A: |120 - 165| = 45 degrees.

## Calendar & Clock :: Gain and loss of time
- A clock that gains or loses a fixed time per hour: track the total difference over the elapsed time.
- Hands coincide 11 times in 12 hours and are at right angles 22 times in 24 hours.

## Alphabet/word arrangement, jumbling :: Alphabetical order of words
- Compare letter by letter from the left. The first different letter decides the order.
Q: Arrange "pen, pencil, pan" alphabetically.
A: pan, pen, pencil.

## Alphabet/word arrangement, jumbling :: Letter rearranging
- Rearrange letters into a meaningful word. Look for common endings like -ING, -TION.
Q: Rearrange "TLAEP" to make a flat dish.
A: PLATE.

## Alphabet/word arrangement, jumbling :: Word formation
- Count how many words can be built from the given letters. Use each letter only as many times as it appears.

## Alphabet/word arrangement, jumbling :: Sentence jumbling
- Find the opening sentence, link pronouns to nouns, match connectors, and place the closing sentence last.

## Syllogism :: All, some, no rules
- All + All = All. Some + All = Some. All + No = No. Some + No = Some not. No + All = Some not.
- All + Some and Some + Some give no definite conclusion.

## Syllogism :: Venn diagram method
- Draw circles. "All A are B": A inside B. "Some A are B": overlap. "No A is B": separate circles. Draw the picture that fits the statements, then test each conclusion.
Q: All pens are books. All books are tables. Do all pens belong to tables?
A: Yes.

## Syllogism :: Two and three statements
- Combine statements pairwise; check the middle term links them. A conclusion that follows must hold in every valid diagram.

## Syllogism :: Either-or and possibility
- If two conclusions are complementary ("Some A are B" and "No A is B"), neither is definite, but either-or follows.
- A possibility is true in at least one valid diagram.

## Venn Diagrams :: Relationship diagrams
- Choose the diagram by relation: one set inside another, overlapping sets, or separate sets.
Q: Pen, Pencil, Stationery?
A: Two separate circles inside a larger one.

## Venn Diagrams :: Counting in overlapping sets
- n(A or B) = n(A) + n(B) - n(A and B). Neither = total - union.
Q: 60 like tea, 50 coffee, 20 both, 100 people.
A: Union 90; neither 10.

## Venn Diagrams :: Three-set problems
- Union = sum of singles - sum of pairs + triple. Fill from the centre outward.

## Statement-Conclusion :: Valid inference
- Accept a conclusion only if it follows from the statement itself. Ignore outside knowledge.
Q: Some trains are late. All trains are late?
A: Does not follow.

## Statement-Conclusion :: Strong and weak arguments
- A strong argument is relevant, specific and important. A weak one is vague, extreme or irrelevant.

## Statement-Conclusion :: Avoiding extreme words
- Words like always, never, only and all are risky unless the statement says them.

## Statement-Course of Action :: Identify the problem
- Read the statement for the problem first, then judge each action as a fix for that problem.

## Statement-Course of Action :: Practical actions
- Good actions are practical, within the authority and directly address the problem (investigate, repair, inform).

## Statement-Course of Action :: Rejecting extreme actions
- Reject actions that are extreme, punish everyone, or avoid the problem.

## Data Sufficiency :: Statement I alone
- Test whether the first statement alone answers the question. Do not use the second.

## Data Sufficiency :: Statement II alone
- Do the same for the second statement on its own.

## Data Sufficiency :: Both together
- Combine them only if neither is enough alone. Check that the combination gives one definite answer.

## Data Sufficiency :: Neither
- If even together they cannot give a single answer, the data is insufficient.

## Puzzle: linear arrangement :: Single-row arrangements
- Draw slots in a line. Place fixed facts first, then relative clues (left of, between, next to).

## Puzzle: linear arrangement :: Ordering clues
- Chain clues into a single order: if A is left of B and B is left of C, A-B-C.

## Puzzle: linear arrangement :: Elimination
- Cross out impossible positions. Keep a column of "cannot be" marks.

## Seating: circular :: Facing the centre
- For people facing the centre, left is clockwise from them.
Q: Six people in a circle facing the centre. A is opposite D. People between A and D on either side?
A: 2.

## Seating: circular :: Facing outward
- Facing outward flips left and right compared to facing the centre.

## Seating: circular :: Mixed facing
- Note each person's facing direction beside their name before reading the next clue.

## Seating: circular :: Opposite and adjacent clues
- Use opposites to fix pairs; adjacent clues then place the remaining people.

## Puzzle: floor/day based :: Floors and persons
- Draw floors as rows. Put definite clues first.
Q: P, Q, R, S, T live on floors 1 to 5. R on 1, S immediately above R, T on 5, P above Q. Find P and Q.
A: R 1, S 2, T 5. Q 3 and P 4.

## Puzzle: floor/day based :: Days and schedules
- Make a table with days as columns and persons or tasks as rows. Fill fixed facts first.

## Puzzle: floor/day based :: Tabulation method
- Put people on one side and attributes on the other; tick sure cells and cross out the rest of the row and column.

## Missing number, matrix :: Row and column rules
- Check whether each row (or column) sums to the same total, or the third is a function of the first two.
Q: 2, 3, 6 / 4, 5, 20 / 3, 4, ?
A: Third = first x second: 12.

## Missing number, matrix :: Figure matrices
- Compare the three figures in each row for rotation, shading or count changes.

## Missing number, matrix :: Diagonal patterns
- If rows and columns do not work, test diagonals or sums of opposite corners.

## Maps & graph interpretation :: Reading a route map
- Convert the route to moves: distances and turns. Then use Pythagoras for the straight-line distance.

## Maps & graph interpretation :: Distance and direction
- Note the scale. Direction of A from B is the opposite of B from A.

## Maps & graph interpretation :: Reading graphs
- Read the axis labels and units before comparing values.

## Maps & graph interpretation :: Percent change from graphs
- Percent change = (new - old) / old x 100. Compare against the right base.
Q: A bar goes from 40 to 50.
A: 25%.

## Decision making + Data analysis :: Rule-based selection
- List every condition. Test each candidate and reject at the first rule broken.
Q: Select graduates under 30. Rahul is 28 with a diploma.
A: Not selected.

## Decision making + Data analysis :: Eligibility conditions
- Check mandatory conditions first, then optional ones that give preference.

## Decision making + Data analysis :: Table-based analysis
- Convert the table to simple ratios or percentages, then compare.
`
