import { QUIZ as G } from '../RRB_Graduate/quiz.js'

const q = (cat, s, text, o, a, e) => ({ cat, s, q: text, o, a, e })

export const QUIZ = [
  ...G,
  // Typing
  q('Typing', 'Typing', 'In speed tests, one "word" is counted as how many keystrokes?', ['5', '4', '6', '10'], 0, 'Spaces count. Gross WPM = (keystrokes ÷ 5) ÷ minutes.'),
  q('Typing', 'Typing', 'The home row keys for the left hand in English are:', ['A S D F', 'Q W E R', 'Z X C V', '1 2 3 4'], 0, 'The right hand uses J K L ;.'),
  q('Typing', 'Typing', 'A typist types 750 keystrokes in 5 minutes. The gross speed is:', ['30 wpm', '25 wpm', '150 wpm', '35 wpm'], 0, '750 ÷ 5 = 150 words in 5 min = 30 wpm.'),
  q('Typing', 'Typing', 'The Inscript layout places consonants mostly under the:', ['Right hand', 'Left hand', 'Both thumbs', 'Little fingers only'], 0, 'Vowels sit under the left hand.'),
  q('Typing', 'Typing', 'Which finger types the Shift key for a letter typed by the left hand?', ['Right little finger', 'Left little finger', 'Right thumb', 'Left index finger'], 0, 'Use the opposite hand.'),
  q('Typing', 'Typing', 'The bumps on the F and J keys help you find the:', ['Home row position', 'Shift keys', 'Number row', 'Space bar'], 0, 'Index fingers rest on them.'),
  // Railway commercial
  q('Commercial', 'GA', 'A PNR number has how many digits?', ['10', '8', '12', '6'], 0, 'Passenger Name Record.'),
  q('Commercial', 'GA', 'RAC stands for:', ['Reservation Against Cancellation', 'Railway Accounts Control', 'Rapid Allotment Counter', 'Reserved AC Coach'], 0, 'RAC passengers get a seat to share until a berth frees up.'),
  q('Commercial', 'GA', 'IRCTC stands for:', ['Indian Railway Catering and Tourism Corporation', 'Indian Railway Control and Transport Council', 'Indian Rail Customer Transport Company', 'Integrated Railway Catering and Travel Cell'], 0, 'It runs online ticketing, catering and tourism.'),
  q('Commercial', 'GA', 'The railway class code 3A means:', ['AC three-tier', 'Third sleeper', 'AC chair car', 'Second sitting'], 0, 'CC is AC chair car and 2S is second sitting.'),
  q('Commercial', 'GA', 'RPF stands for:', ['Railway Protection Force', 'Rail Passenger Federation', 'Railway Police Fund', 'Regional Protection Force'], 0, 'It guards railway property and passengers.'),
  q('Commercial', 'GA', 'UTS in railways refers to the:', ['Unreserved Ticketing System', 'Universal Train Schedule', 'Urban Transit Service', 'Unified Tariff System'], 0, 'Used for unreserved and platform tickets.'),
  q('Commercial', 'GA', 'The integrated railway helpline number is:', ['139', '100', '108', '1091'], 0, 'For enquiries and complaints.'),
  q('Commercial', 'GA', 'A red signal on the railway means:', ['Stop', 'Proceed', 'Caution', 'Reduce speed only'], 0, 'Yellow is caution and green is proceed.'),
  // Accounts
  q('Accounts', 'GA', 'The accounting equation is:', ['Assets = Liabilities + Capital', 'Assets = Capital − Liabilities', 'Capital = Assets + Liabilities', 'Liabilities = Assets + Capital'], 0, 'Rearranged: Capital = Assets − Liabilities.'),
  q('Accounts', 'GA', 'For a personal account, the rule is:', ['Debit the receiver, credit the giver', 'Debit the giver, credit the receiver', 'Debit all incomes', 'Credit all expenses'], 0, 'Real: debit what comes in. Nominal: debit expenses.'),
  q('Accounts', 'GA', 'The book that records day-to-day cash receipts and payments is the:', ['Cash book', 'Trial balance', 'Ledger', 'Balance sheet'], 0, 'It also acts as a ledger for the cash account.'),
  q('Accounts', 'GA', 'A trial balance is prepared to check that:', ['Total debits equal total credits', 'Profit is maximum', 'Stock is correct', 'Tax is paid'], 0, 'It checks arithmetical accuracy of the ledger.'),
  q('Accounts', 'GA', 'GST charged on a sale between two states is:', ['IGST', 'CGST', 'SGST', 'Customs duty'], 0, 'Within a state it is CGST plus SGST.'),
  q('Accounts', 'GA', 'An asset costs 1,00,000, has a scrap value of 10,000 and a life of 5 years. Straight-line depreciation a year is:', ['18,000', '20,000', '22,000', '10,000'], 0, '(1,00,000 − 10,000) ÷ 5.'),
]
export const QUIZ_CATS = ['All', ...Array.from(new Set(QUIZ.map((x) => x.cat)))]
