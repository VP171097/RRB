// Extra drill questions for the topics the week 8 to 13 drills rotate through. Format: "## Topic", then "Q: question | A: answer" lines.
export default `
## Number System + divisibility
Q: Is 7,293 divisible by 9? | A: Digit sum 7 + 2 + 9 + 3 = 21, not a multiple of 9, so no.
Q: Unit digit of 7 to the power 83? | A: Cycle 7, 9, 3, 1. 83 mod 4 = 3, so the third term: 3.
Q: Number of factors of 180? | A: 180 = 2^2 x 3^2 x 5, so 3 x 3 x 2 = 18.
Q: Remainder when 2^10 is divided by 7? | A: Powers of 2 give remainders 2, 4, 1, repeating every 3. 10 mod 3 = 1, so 2.

## HCF & LCM
Q: HCF and LCM of 18 and 24? | A: HCF 6, LCM 72.
Q: HCF of 3/4 and 9/10? | A: HCF(3, 9) / LCM(4, 10) = 3/20.
Q: Smallest number leaving remainder 5 when divided by 6, 8 and 12? | A: LCM 24 + 5 = 29.
Q: HCF of two numbers is 8 and their LCM is 240. One number is 48. The other? | A: 8 x 240 / 48 = 40.

## Simplification, BODMAS, surds
Q: 36 / 4 x 3 - 5 + 2? | A: 9 x 3 - 5 + 2 = 24.
Q: Cube root of 5832? | A: Ends in 2, so the root ends in 8. The remaining 5 lies between 1 cubed and 2 cubed, so the tens digit is 1. Answer 18.
Q: Square root of 2025? | A: 45.
Q: 2^7 / 2^4 x 2^-1? | A: 2^(7 - 4 - 1) = 4.

## Fractions & Decimals
Q: 5/8 as a percent? | A: 62.5%.
Q: Convert 0.3636... to a fraction. | A: 36/99 = 4/11.
Q: Which is greater: 4/7 or 5/9? | A: 4 x 9 = 36 and 5 x 7 = 35, so 4/7.
Q: 0.25 x 0.04? | A: 0.01.

## Percentage I
Q: 35% of 240? | A: 84.
Q: A rise from 150 to 195 is what percent? | A: 45 / 150 = 30%.
Q: Up 10%, then up 20%. Net change? | A: 10 + 20 + 2 = 32%.
Q: After a 25% increase a value is 500. Original? | A: 400.

## Percentage II + calculation tricks
Q: Price up 20%. Cut in consumption to hold spending equal? | A: 20/120 = 16.67%.
Q: A town of 20,000 grows 5% a year for 2 years. Population? | A: 20,000 x 1.05 x 1.05 = 22,050.
Q: 76 x 24 using the squares trick (50 + 26)(50 - 26)? | A: 50^2 - 26^2 = 2500 - 676 = 1824.
Q: 105 x 95? | A: 100^2 - 5^2 = 9975.

## Ratio & Proportion
Q: Divide 910 in the ratio 3:4:6. | A: 13 parts of 70: 210, 280, 420.
Q: A:B = 3:5 and B:C = 10:7. A:B:C? | A: Make B 10: A:B = 6:10; so 6:10:7.
Q: If 8 pens cost 120, cost of 15 pens? | A: 225.
Q: Mean proportion of 9 and 16? | A: 12.

## Partnership + Ages
Q: A invests 5000 for 12 months, B invests 8000 for 6 months. Profit ratio? | A: 60000 : 48000 = 5 : 4.
Q: Father is 4 times his son's age. After 6 years he will be 3 times. Son's age now? | A: 4x + 6 = 3(x + 6), so x = 12.
Q: Ages are 4:5; 10 years later 6:7. Present ages? | A: 7(4x + 10) = 6(5x + 10) gives x = 10; ages 40 and 50.
Q: The sum of ages of two brothers is 35 and their ratio is 3:4. The younger is? | A: 15.

## Average
Q: Average of 10 numbers is 18. If one number, 28, is removed, the new average? | A: (180 - 28)/9 = 16.89.
Q: Average of the first 20 natural numbers? | A: 10.5.
Q: A batter averages 40 in 9 innings and scores 60 in the 10th. New average? | A: 42.
Q: Average age of 4 men is 30; a fifth joins and the average becomes 32. Age of the fifth? | A: 40.

## Profit & Loss I
Q: CP 400, SP 460. Profit percent? | A: 15%.
Q: SP is 540 at a loss of 10%. CP? | A: 600.
Q: Profit is 25% on cost. Profit on SP? | A: 20%.
Q: Two articles sell at 990 each, one at 10% gain and one at 10% loss. Net? | A: Loss of 1 percent.

## Profit & Loss II (discount, false weights)
Q: MP 800, discount 15%. SP? | A: 680.
Q: Successive discounts of 10% and 20%. Single discount? | A: 28%.
Q: A shopkeeper uses 800 g for 1 kg. Gain percent? | A: 200 / 800 x 100 = 25%.
Q: After 20% discount an item sells for 1,200. MP? | A: 1,500.

## Simple Interest
Q: SI on 8,000 at 5% for 3 years? | A: 1,200.
Q: A sum of 2,500 becomes 3,000 in 4 years. Rate? | A: SI 500 = 2500 x R x 4/100, so R = 5%.
Q: In how many years does a sum triple at 10% SI? | A: 100 x 2 / 10 = 20 years.
Q: Amount after 2 years at 6% SI on 5,000? | A: 5,600.

## Compound Interest
Q: CI on 5,000 at 10% for 2 years? | A: 1,050.
Q: CI - SI on 8,000 for 2 years at 5%? | A: 8000 x 0.0025 = 20.
Q: 10,000 at 20% a year, compounded half-yearly for 1 year. Amount? | A: 10,000 x 1.1 x 1.1 = 12,100.
Q: A sum becomes 4 times in 2 years at CI. Rate? | A: (1 + r)^2 = 4 gives 100%.

## Time & Work I
Q: A takes 15 days and B takes 10 days. Together? | A: 6 days.
Q: A and B finish in 12 days, A alone in 20. B alone? | A: 30 days.
Q: A, B, C do a job in 10, 15 and 30 days. Together? | A: 5 days.
Q: A can do a job in 10 days. He works 3 days and leaves; B finishes the rest in 6 days. B alone? | A: Remaining work 7/10 in 6 days, so B alone takes 6 x 10/7, about 8.6 days.

## Time & Work II (pipes, wages)
Q: Pipe A fills in 20 minutes, B in 30. Together? | A: 12 minutes.
Q: A fills in 10 hours, a leak empties in 15. Time to fill? | A: 30 hours.
Q: A and B earn 1,200 for a job done in the ratio 3:2. A's pay? | A: 720.
Q: Pipe fills in 6 hours, with a leak it takes 8. Leak empties in? | A: 24 hours.

## Mixture & Alligation
Q: Mix 30 L at 40 and 20 L at 65 per litre. Mean price? | A: (1200 + 1300)/50 = 50.
Q: Ratio of 25% and 40% solutions to make 30%? | A: 10 : 5 = 2 : 1.
Q: 60 L milk, 6 L removed and replaced with water once. Milk left? | A: 54 L.
Q: Cheaper tea 30, dearer 50. Mean 38. Ratio? | A: 12 : 8 = 3 : 2.

## Time, Speed & Distance I
Q: 120 km in 2 hours 30 minutes. Speed? | A: 48 km/h.
Q: 54 km/h in m/s? | A: 15.
Q: Two cars start 270 km apart towards each other at 40 and 50 km/h. Time to meet? | A: 3 hours.
Q: 40 km/h up a hill and 60 km/h down the same road. Average speed? | A: 48 km/h.

## Time, Speed & Distance II (trains, boats)
Q: A 200 m train at 72 km/h passes a pole. Time? | A: 10 seconds.
Q: Boat speed 10 km/h, stream 2 km/h. Downstream time for 36 km? | A: 3 hours.
Q: Two trains of 120 m and 180 m at 60 and 40 km/h move towards each other. Time to cross? | A: 300 / (100 x 5/18) = 10.8 seconds.
Q: A man rows 12 km downstream and 12 km upstream in 5 hours; stream is 2 km/h. Boat speed? | A: 12/(b + 2) + 12/(b - 2) = 5, so b = 5 km/h.

## Algebra: identities
Q: x + y = 9 and xy = 20. x^2 + y^2? | A: 81 - 40 = 41.
Q: x - 1/x = 4. x^2 + 1/x^2? | A: 16 + 2 = 18.
Q: 99^2 using an identity? | A: (100 - 1)^2 = 9801.
Q: a + b + c = 0. Find (a^3 + b^3 + c^3)/abc. | A: 3.

## Algebra: equations
Q: 5x - 7 = 3x + 9. x? | A: 8.
Q: x + y = 14 and x - y = 2. x and y? | A: 8 and 6.
Q: A number added to 40% of itself gives 70. The number? | A: 50.
Q: x^2 - 7x + 12 = 0. Roots? | A: 3 and 4.

## Mensuration 2D
Q: Area of a triangle with sides 13, 14, 15? | A: 84.
Q: Radius of a circle with area 154? | A: 7.
Q: A rectangle's perimeter is 60 and length is twice the breadth. Area? | A: 200.
Q: Diagonal of a square of side 6? | A: 6 root 2.

## Number series
Q: 4, 9, 16, 25, ? | A: 36.
Q: 2, 6, 18, 54, ? | A: 162.
Q: 1, 2, 6, 24, ? | A: 120.
Q: 5, 11, 23, 47, ? | A: 95.

## Alphabet series
Q: A, D, G, J, ? | A: M.
Q: Z, X, V, T, ? | A: R.
Q: AB, DE, GH, ? | A: JK.
Q: Opposite letter of K? | A: P.

## Analogy
Q: Cat : Kitten :: Dog : ? | A: Puppy.
Q: 7 : 49 :: 9 : ? | A: 81.
Q: Book : Read :: Food : ? | A: Eat.
Q: Pilot : Aircraft :: Driver : ? | A: Car.

## Classification (odd one out)
Q: 3, 5, 9, 11, 13. Odd one? | A: 9 (not prime).
Q: Rose, Lotus, Tulip, Mango. Odd one? | A: Mango.
Q: 16, 25, 36, 48. Odd one? | A: 48 (not a square).
Q: Delhi, Mumbai, Kolkata, Ganga. Odd one? | A: Ganga.

## Coding-Decoding I
Q: If MAN is coded NBO, what is BOY? | A: CPZ.
Q: Reverse-alphabet code of DOG? | A: WLT.
Q: A = 1, B = 2. Code of BAG as a sum? | A: 2 + 1 + 7 = 10.
Q: In a code, TREE is UTHI (+1, +2, +3, +4). Code of SKY? | A: TMB.

## Coding-Decoding II
Q: If 1 is coded 5, 2 is 6, 3 is 7, what is 9? | A: 13.
Q: If RED is called BLUE, and BLUE is called GREEN, what colour is the sky? | A: Green.
Q: A + B means A is B's mother. What does B + A mean? | A: B is A's mother.
Q: In a code, CAT = 24 and DOG = 26 (sum of letter positions: 3 + 1 + 20 = 24; 4 + 15 + 7 = 26). Code for BAT? | A: 2 + 1 + 20 = 23.

## Blood Relations
Q: A is B's brother. C is A's mother. D is C's father. D is B's what? | A: Maternal grandfather.
Q: Pointing to a photo, a man says, "His mother is my mother's only daughter." Relation? | A: The photo shows the man's sister's son, so nephew.
Q: P is the father of Q. R is the sister of P. R is Q's what? | A: Paternal aunt.
Q: A's wife's brother is B. B is A's what? | A: Brother-in-law.

## Direction & Distance
Q: Walk 8 km west and 6 km north. Distance from the start? | A: 10 km.
Q: Facing east, turn left, then right, then right. Now facing? | A: North, then east, then south.
Q: A man walks 5 m north, 5 m east, 5 m south. Direction from the start? | A: East, 5 m.
Q: Sunrise, a shadow falls to a man's left. Which way does he face? | A: North.

## Ranking & Order
Q: 15th from the left in a row of 40. Position from the right? | A: 26th.
Q: A is 8th from the top and 12th from the bottom. Total? | A: 19.
Q: People between rank 9 and rank 21? | A: 11.
Q: In a queue A is 6th from the front. B is 4 places behind A. B's position? | A: 10th.

## Mathematical Operations
Q: If + means x, x means -, - means +, find 10 + 3 x 4 - 2. | A: 10 x 3 - 4 + 2 = 28.
Q: If / means +, + means /, find 12 / 4 + 2. | A: 12 + 4 / 2 = 14.
Q: Swap 3 and 7: 3 x 7 + 3. | A: 7 x 3 + 7 = 28.
Q: Replace - with x and x with -: 9 - 2 x 4. | A: 9 x 2 - 4 = 14.

## Calendar & Clock
Q: 1 January 2001 was a Monday. Day on 1 January 2002? | A: Tuesday.
Q: Angle at 7:20? | A: |210 - 110| = 100 degrees.
Q: How many odd days in 200 years? | A: 3.
Q: Is 2100 a leap year? | A: No.

## Alphabet/word arrangement, jumbling
Q: Arrange alphabetically: Ban, Bat, Bag. | A: Bag, Ban, Bat.
Q: Rearrange EMTI to a word. | A: TIME or ITEM.
Q: Which word is first in a dictionary: Table, Tablet, Tab? | A: Tab.
Q: Which word comes last: Cart, Cat, Car? | A: Cat.

## Syllogism
Q: All dogs are animals. Some animals are pets. Conclusion: some dogs are pets? | A: Does not follow.
Q: No A is B. All B are C. Conclusion: some C are not A? | A: Follows.
Q: Some A are B. All B are C. Conclusion: some A are C? | A: Follows.
Q: All A are B. No B is C. Conclusion: no A is C? | A: Follows.

## Venn Diagrams
Q: 70 like football, 40 like cricket, 15 like both. People who like at least one? | A: 95.
Q: Of 100 people, 60 play chess, 50 play carrom, 20 play both. Who play neither? | A: 10.
Q: Which diagram fits Mother, Father, Parents? | A: Two overlapping circles inside or side by side within Parents.
Q: Doctors, Teachers, Women: which diagram? | A: Three overlapping circles, since a woman can be a doctor, a teacher, or neither.

## Statement-Conclusion
Q: Statement: Some roads are rough. Conclusion: all roads are rough? | A: Does not follow.
Q: Statement: All birds can fly. Penguin is a bird. Conclusion: a penguin can fly? | A: Follows from the statements, even if untrue in the world.
Q: Statement: No student is lazy. Conclusion: Ravi is lazy, so Ravi is not a student? | A: Follows.
Q: Statement: Rain falls in monsoon. Conclusion: It never rains in winter? | A: Does not follow.

## Statement-Course of Action
Q: Problem: a road is full of potholes. Is "repair the road" a good action? | A: Yes.
Q: Problem: exam paper leaked. "Cancel the exam and investigate"? | A: Reasonable.
Q: Problem: frequent power cuts. "Close all factories"? | A: Extreme; reject.
Q: Problem: water pipes leaking. "Do nothing"? | A: Reject.

## Data Sufficiency
Q: What is x? I. x + 5 = 9. II. x > 3. | A: I alone is enough.
Q: How old is A? I. A is older than B. II. B is 20. | A: Both together give only a lower bound, so not sufficient.
Q: Is P a multiple of 6? I. P is even. II. P is a multiple of 3. | A: Both together are needed.
Q: Which is the tallest? I. A is taller than B. II. B is taller than C. | A: Together they place A tallest among the three.

## Puzzle: linear arrangement
Q: Five people A to E in a row. A is at the left end, B is next to A, C is at the right end, D is left of C. Order? | A: A, B, E, D, C.
Q: P is 3rd from the left in a row of 7. Q is 2 places to P's right. Q's position? | A: 5th.
Q: In a row of 6, A is between B and C, and B is at the left end. Possible order? | A: B, A, C, ...
Q: X sits to the left of Y, Y to the left of Z. Who is in the middle? | A: Y.

## Seating: circular
Q: Eight people in a circle facing the centre. Opposite to the 1st is the? | A: 5th.
Q: In a circle, A is second to the left of B. If everyone faces the centre, where is A? | A: Two places clockwise from B.
Q: Six friends in a circle. Number of arrangements ignoring rotation? | A: 5! = 120.
Q: If facing outward, left becomes? | A: The opposite side of facing inward.

## Puzzle: floor/day based
Q: Five floors, P above Q, R on floor 1. S directly above R. Possible P and Q? | A: Q on 3 or 4, P above Q.
Q: Meetings Mon to Fri, A before B, B before C. Who is earliest? | A: A.
Q: Four people, four days, no two on the same day. How many arrangements? | A: 24.
Q: Floors 1 to 6, T is on 6, U on 4. Which floor can V be on? | A: Any of 1, 2, 3 or 5.

## Missing number, matrix
Q: 2, 5, 10 / 3, 6, 18 / 4, 7, ? | A: 28 (third = first x second).
Q: 1, 4, 9 / 2, 8, 18 / 3, 12, ? | A: 27.
Q: Rows sum to 15: 4, 5, 6 / 7, ?, 3 | A: 5.
Q: 3, 9, 27 / 2, 4, 8 / 5, 10, ? | A: 20.

## Ancient History
Q: Who found Harappa? | A: Daya Ram Sahni (1921).
Q: Which king fought the Kalinga war? | A: Ashoka (261 BCE).
Q: Who wrote the Arthashastra? | A: Kautilya (Chanakya).
Q: Who was the Gupta king called the Napoleon of India? | A: Samudragupta.

## Medieval History
Q: Who won the First Battle of Panipat? | A: Babur (1526).
Q: Who built the Red Fort? | A: Shah Jahan.
Q: Which dynasty followed the Khaljis? | A: Tughlaq.
Q: Who founded Vijayanagara? | A: Harihara and Bukka (1336).

## Modern History I (1757-1857)
Q: Battle of Plassey year? | A: 1757.
Q: Who introduced the Doctrine of Lapse? | A: Lord Dalhousie.
Q: First Governor-General of India? | A: William Bentinck.
Q: Where did the Revolt of 1857 begin? | A: Meerut.

## Modern History II (1857-1947)
Q: Who presided over the first session of the Indian National Congress (1885)? | A: W.C. Bonnerjee.
Q: Dandi March year? | A: 1930.
Q: Quit India started in? | A: 1942.
Q: Last Viceroy of India? | A: Lord Mountbatten.

## Art & Culture: dance, music, painting
Q: Kuchipudi belongs to? | A: Andhra Pradesh.
Q: Madhubani painting is from? | A: Bihar.
Q: Kathakali is from? | A: Kerala.
Q: Bihu is a folk dance of? | A: Assam.

## Monuments, Literature, Books
Q: Who wrote Gitanjali? | A: Rabindranath Tagore.
Q: Where is the Konark Sun Temple? | A: Odisha.
Q: Charminar is in? | A: Hyderabad.
Q: Who wrote Shakuntalam? | A: Kalidasa.

## Indian Geography I: physiography, rivers
Q: Highest peak in India? | A: Kanchenjunga.
Q: Longest river in India? | A: Ganga.
Q: Largest brackish lake? | A: Chilika.
Q: Which rivers flow west into the Arabian Sea? | A: Narmada and Tapi.

## Geography II: climate, soil, vegetation
Q: Soil best for cotton? | A: Black (regur) soil.
Q: Months of the south-west monsoon? | A: June to September.
Q: First national park in India? | A: Jim Corbett.
Q: Mangrove forests are found in? | A: Sundarbans.

## Geography III: agriculture, minerals, industry
Q: Kharif crops? | A: Rice, maize, cotton.
Q: Jharia is known for? | A: Coal.
Q: Tropic of Cancer passes through how many states? | A: 8.
Q: Steel plant at Rourkela is in? | A: Odisha.

## World Geography
Q: Largest ocean? | A: Pacific.
Q: Capital of Australia? | A: Canberra.
Q: Highest peak in the world? | A: Mount Everest.
Q: Largest hot desert? | A: Sahara.

## Polity I: Preamble, Rights, DPSP
Q: Which article gives the right to constitutional remedies? | A: Article 32.
Q: Which amendment added Socialist and Secular to the Preamble? | A: 42nd.
Q: DPSPs are in which part? | A: Part IV.
Q: Article 21A deals with? | A: Free education, ages 6 to 14.

## Polity II: Parliament, President, Judiciary
Q: Maximum strength of the Lok Sabha? | A: 550.
Q: Who chairs the Rajya Sabha? | A: Vice-President.
Q: Article for the Supreme Court? | A: 124.
Q: A Money Bill starts in? | A: Lok Sabha.

## Polity III: amendments, bodies, Panchayati Raj
Q: 73rd Amendment is about? | A: Panchayati Raj.
Q: Article for the Election Commission? | A: 324.
Q: Article for President's Rule in a state? | A: 356.
Q: GST came by which amendment? | A: 101st.

## Economy I: basics, planning, NITI Aayog
Q: NITI Aayog replaced? | A: Planning Commission (2015).
Q: First Five-Year Plan began in? | A: 1951.
Q: Which sector gives the largest share of GDP? | A: Services.
Q: Inflation is measured by? | A: CPI and WPI.

## Economy II: banking, RBI, budget, taxes
Q: RBI was set up in? | A: 1935.
Q: Union Budget is presented on? | A: 1 February.
Q: GST launched on? | A: 1 July 2017.
Q: Repo rate is the rate at which? | A: RBI lends to banks.

## Economy III: schemes, PSUs, organisations
Q: Jan Dhan Yojana is for? | A: Bank accounts for all.
Q: Ayushman Bharat is for? | A: Health cover.
Q: NABARD supports? | A: Agriculture and rural credit.
Q: SEBI regulates? | A: Securities markets.

## Physics I: motion, force, energy
Q: Unit of force? | A: Newton.
Q: Formula for kinetic energy? | A: Half m v squared.
Q: Escape velocity from Earth? | A: 11.2 km/s.
Q: Newton's third law says? | A: Action and reaction are equal and opposite.

## Physics II: light, sound, electricity
Q: Mirror used as a rear-view mirror? | A: Convex.
Q: Lens that corrects myopia? | A: Concave.
Q: Unit of resistance? | A: Ohm.
Q: Audible range of sound? | A: 20 Hz to 20 kHz.

## Chemistry I: matter, atoms, acids
Q: pH of pure water? | A: 7.
Q: Formula of baking soda? | A: NaHCO3.
Q: Atomic number of carbon? | A: 6.
Q: Acid in lemon juice? | A: Citric acid.

## Chemistry II: metals, carbon, everyday chemistry
Q: Liquid metal at room temperature? | A: Mercury.
Q: Alloy of copper and zinc? | A: Brass.
Q: Hardest form of carbon? | A: Diamond.
Q: Main component of CNG? | A: Methane.

## Biology I: human body
Q: Number of bones in an adult? | A: 206.
Q: Largest gland? | A: Liver.
Q: Smallest bone? | A: Stapes.
Q: Where does digestion of starch begin? | A: Mouth.
`
