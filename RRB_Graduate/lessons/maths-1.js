// Lesson text format: "## Topic :: Sub-topic", then paragraphs, "- key point" lines, and optional "Q:" and "A:" lines.
export default `
## Number System + divisibility :: Types of numbers
Numbers are grouped by what they allow. Know the groups and where zero and negatives fit, because many questions test these definitions.
- Natural numbers: 1, 2, 3 ... Whole numbers: 0, 1, 2 ...
- Integers include negatives: ... -2, -1, 0, 1, 2 ...
- Rational numbers can be written as p/q with q not 0. Irrational numbers (like root 2 and pi) cannot.
- Real numbers are all rational and irrational numbers together.
Q: Is 0 a natural number? Is root 9 rational?
A: 0 is whole but not natural. Root 9 = 3, so it is rational.

## Number System + divisibility :: Divisibility rules (2 to 13)
A divisibility rule lets you test a number without dividing.
- 2: last digit even. 3: digit sum divisible by 3. 4: last two digits divisible by 4. 5: ends in 0 or 5.
- 6: divisible by both 2 and 3. 8: last three digits divisible by 8. 9: digit sum divisible by 9.
- 11: difference of the sums of alternate digits is 0 or a multiple of 11.
- 7: double the last digit and subtract it from the rest; repeat. 13: add 4 times the last digit to the rest.
Q: Is 5291 divisible by 11?
A: (5 + 9) - (2 + 1) = 14 - 3 = 11, so yes.

## Number System + divisibility :: Prime and composite numbers
A prime number has exactly two factors: 1 and itself. A composite number has more than two. 1 is neither.
- Primes below 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47.
- 2 is the only even prime.
- To test whether n is prime, check divisibility by primes up to the square root of n.
Q: Is 113 prime?
A: The square root is a little over 10. It is not divisible by 2, 3, 5 or 7, so 113 is prime.

## Number System + divisibility :: Remainders and unit digit
The unit digit of a power repeats in a cycle, so you only need the remainder of the exponent.
- Cycles: 2 gives 2, 4, 8, 6. 3 gives 3, 9, 7, 1. 7 gives 7, 9, 3, 1. 8 gives 8, 4, 2, 6. 4 gives 4, 6. 9 gives 9, 1. 0, 1, 5, 6 never change.
- Divide the power by the cycle length. Remainder 0 means the last term of the cycle.
- For remainders, use a smaller equivalent: 17 divided by 5 has the same remainder as 2.
Q: Unit digit of 3 to the power 50?
A: Cycle length 4. 50 divided by 4 leaves 2, so the second term: 9.

## Number System + divisibility :: Factors and number of factors
Write the number as a product of prime powers, N = p^a x q^b.
- Number of factors = (a + 1)(b + 1).
- Sum of factors = (p^(a+1) - 1)/(p - 1) x (q^(b+1) - 1)/(q - 1).
- A number has an odd count of factors only if it is a perfect square.
Q: How many factors does 360 have?
A: 360 = 2^3 x 3^2 x 5. Factors = 4 x 3 x 2 = 24.

## HCF & LCM :: Prime factorisation method
Break each number into primes. HCF takes the lowest power of each common prime; LCM takes the highest power of every prime.
- Example: 36 = 2^2 x 3^2 and 48 = 2^4 x 3.
- HCF = 2^2 x 3 = 12. LCM = 2^4 x 3^2 = 144.
Q: Find HCF and LCM of 24 and 60.
A: 24 = 2^3 x 3, 60 = 2^2 x 3 x 5. HCF = 12. LCM = 2^3 x 3 x 5 = 120.

## HCF & LCM :: Division method
Divide the larger number by the smaller; divide the divisor by the remainder; repeat until the remainder is 0. The last divisor is the HCF.
- For three numbers, find the HCF of two, then take the HCF of that result and the third.
- LCM of two numbers = (product of the numbers) / HCF.
Q: HCF of 84 and 126?
A: 126 = 84 x 1 + 42; 84 = 42 x 2 + 0. HCF = 42.

## HCF & LCM :: HCF x LCM = product of two numbers
For any two numbers a and b: HCF x LCM = a x b. This works only for two numbers.
- If you know any three of the four values, you can find the fourth.
- Use it to find a missing number quickly.
Q: HCF is 12, LCM is 180, one number is 36. Find the other.
A: 12 x 180 / 36 = 60.

## HCF & LCM :: HCF and LCM of fractions
- HCF of fractions = HCF of numerators / LCM of denominators.
- LCM of fractions = LCM of numerators / HCF of denominators.
- Fractions must be in lowest terms first.
Q: HCF of 2/3 and 4/9?
A: HCF(2, 4) / LCM(3, 9) = 2/9.

## HCF & LCM :: Word problems: bells, tiles, containers
- Events that repeat together: use LCM (when will they coincide again).
- Largest equal pieces, tiles or containers: use HCF.
- Number leaving the same remainder r: LCM + r. Leaving remainder k less than each divisor: LCM - k.
Q: Largest tile to cover a floor 420 cm by 300 cm exactly?
A: HCF(420, 300) = 60 cm.

## Simplification, BODMAS, surds :: BODMAS order
Work in this order: Brackets, Of, Division, Multiplication, Addition, Subtraction. Division and multiplication share a level (left to right); so do addition and subtraction.
- Clear brackets from the inside out: ( ) then { } then [ ].
- "Of" means multiply and is done before division.
Q: 8 + 12 / 4 x 3 - 2?
A: 12 / 4 = 3, x 3 = 9; 8 + 9 - 2 = 15.

## Simplification, BODMAS, surds :: Vinculum and brackets
A vinculum is a bar over an expression that groups it. Solve the vinculum first, then ordinary brackets.
- A minus sign before a bracket flips every sign inside when the bracket is removed.
Q: 15 - (3 - 5)?
A: 3 - 5 = -2; 15 - (-2) = 17.

## Simplification, BODMAS, surds :: Square and cube roots
- Learn squares to 30 and cubes to 15.
- Square root of a perfect square: use last-digit pairs (1 or 9 from 1; 4 from 2 or 8; 9 from 3 or 7; 6 from 4 or 6; 5 from 5).
- Cube root: the last digit of the cube fixes the last digit of the root.
Q: Cube root of 2744?
A: It ends in 4, so the root ends in 4. The remaining 2 lies between 1 cubed and 2 cubed, so the tens digit is 1. Answer 14.

## Simplification, BODMAS, surds :: Surds and indices
- a^m x a^n = a^(m+n). a^m / a^n = a^(m-n). (a^m)^n = a^(mn). a^0 = 1. a^(-n) = 1/a^n.
- Root of a to the power n is a^(1/n).
- Remember root 2 = 1.414, root 3 = 1.732, root 5 = 2.236.
Q: Simplify 2^5 x 2^-3.
A: 2^(5-3) = 4.

## Simplification, BODMAS, surds :: Approximation
Round each number to something easy, compute, then pick the closest option.
- Round to the nearest 10, 100 or a clean fraction.
- Use percent-fraction equivalents (12.5% = 1/8).
Q: About 49.8% of 402?
A: 50% of 400 = 200.

## Fractions & Decimals :: Fraction types and conversion
- Proper fractions are below 1; improper are 1 or above; a mixed number is a whole part plus a fraction.
- Convert a mixed number to improper: (whole x denominator + numerator) / denominator.
- Decimal to fraction: write over 10, 100, 1000 and reduce.
Q: Convert 2 3/4 to improper.
A: (2 x 4 + 3) / 4 = 11/4.

## Fractions & Decimals :: Comparing and ordering
- Cross-multiply to compare two fractions.
- With the same numerator, the bigger denominator gives the smaller fraction.
- Or convert each fraction to a percent or decimal.
Q: Which is bigger, 5/8 or 7/12?
A: 5 x 12 = 60 and 7 x 8 = 56, so 5/8 is bigger.

## Fractions & Decimals :: Recurring decimals
- 0.ab (bar over both) = ab/99. 0.abc (bar) = abc/999.
- For a mixed recurring decimal: (all digits - non-repeating digits) / (9s for repeating, 0s for non-repeating).
Q: Convert 0.1666... to a fraction.
A: (16 - 1)/90 = 15/90 = 1/6.

## Fractions & Decimals :: Operations on decimals
- Add and subtract by lining up the decimal points.
- Multiply as whole numbers, then place the decimal by counting total places.
- To divide by a decimal, shift the point in both numbers until the divisor is whole.
Q: 0.6 x 0.07?
A: 6 x 7 = 42 with 3 decimal places: 0.042.

## Fractions & Decimals :: Fraction to percent table
Memorise: 1/2 = 50, 1/3 = 33.33, 1/4 = 25, 1/5 = 20, 1/6 = 16.67, 1/7 = 14.28, 1/8 = 12.5, 1/9 = 11.11, 1/10 = 10, 1/11 = 9.09, 1/12 = 8.33, 1/16 = 6.25.
- Build the rest by multiplying: 3/8 = 3 x 12.5 = 37.5.
Q: 7/8 as a percent?
A: 7 x 12.5 = 87.5.

## Percentage I :: Percent as a fraction
Percent means per hundred. x% = x/100.
- Use fractions for common percents: 25% = 1/4, 20% = 1/5, 12.5% = 1/8.
Q: 37.5% of 480?
A: 3/8 of 480 = 180.

## Percentage I :: Percentage of a number
- x% of N = x x N / 100.
- "A is what percent of B" = A/B x 100.
Q: 18 is what percent of 72?
A: 18/72 x 100 = 25%.

## Percentage I :: Percent change
- Percent change = (new - old) / old x 100.
- Always divide by the old value.
Q: A price goes from 80 to 100. Percent rise?
A: 20/80 x 100 = 25%.

## Percentage I :: Successive change
- Two changes of a% and b%: a + b + ab/100 (use negative for decreases).
- A rise of x% then a fall of x% is a loss of x^2/100 percent.
Q: Up 20%, then down 20%.
A: 20 - 20 - 4 = -4%.

## Percentage I :: Finding the original value
- Original = new value / (1 + change). For a 25% rise, original = new / 1.25.
- Or use fractions: a 25% rise means the new value is 5/4 of the old.
Q: After a 20% increase a price is 600. Original?
A: 600 / 1.2 = 500.

## Percentage II + calculation tricks :: Expenditure and consumption
- If the price rises r%, cut consumption by r/(100 + r) x 100 percent to keep spending equal.
- If the price falls r%, consumption can rise by r/(100 - r) x 100 percent.
Q: Price up 25%. Consumption cut to keep spending equal?
A: 25/125 x 100 = 20%.

## Percentage II + calculation tricks :: Population growth and depreciation
- Growth: final = P x (1 + r/100)^n. Depreciation: final = P x (1 - r/100)^n.
- For different rates in different years, multiply the factors one after another.
Q: Population 10,000 grows 10% a year for 2 years.
A: 10,000 x 1.1 x 1.1 = 12,100.

## Percentage II + calculation tricks :: Marks and election problems
- Pass marks problems: set up (pass % of total) = marks scored + marks short.
- Election: valid votes = total votes - invalid votes; winner's margin = difference of the two shares.
Q: A student gets 40% and fails by 30 marks. Pass mark is 50%. Total marks?
A: 10% of total = 30, so total = 300.

## Percentage II + calculation tricks :: Squares, cubes and multiplication tricks
- Square of a number ending in 5: n x (n + 1) then 25. (35^2 = 12|25 = 1225)
- x 11: write the first digit, add neighbouring digits, write the last digit.
- x 5 = x 10 / 2. x 25 = x 100 / 4. x 99 = x 100 minus the number.
Q: 48 x 25?
A: 4800 / 4 = 1200.

## Percentage II + calculation tricks :: Vedic shortcuts
- Near 100: (100 - a)(100 - b) = (100 - a - b) | (a x b).
- Squares near 50: (50 + d)^2 = 2500 + 100d + d^2.
- Subtract from a power of 10 by taking 9 from each digit except the last, which comes from 10.
Q: 97 x 94?
A: 100 - 3 - 6 = 91, and 3 x 6 = 18. So 9118.
`
