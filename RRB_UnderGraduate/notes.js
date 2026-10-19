import { NOTES as G } from '../RRB_Graduate/notes.js'

const COMMERCIAL = {
  id: 'comm', title: 'Railway commercial basics', b: [
    ['h', 'Tickets and terms'],
    ['ul', ['PNR is a 10-digit Passenger Name Record number', 'CNF confirmed, RAC reservation against cancellation, WL waiting list, RLWL remote location waiting list', 'PRS is the Passenger Reservation System; UTS is the Unreserved Ticketing System; IRCTC is the Indian Railway Catering and Tourism Corporation', 'The integrated railway helpline is 139', 'Rules on advance booking period, refund slabs and Tatkal timings change from time to time: read the current rules before you rely on a number']],
    ['table', [['Class code', 'Meaning'], ['1A', 'First AC'], ['2A', 'AC two-tier'], ['3A', 'AC three-tier'], ['3E', 'AC three-tier economy'], ['SL', 'Sleeper class'], ['CC', 'AC chair car'], ['EC', 'Executive chair car'], ['2S', 'Second sitting']]],
    ['table', [['Short form', 'Full form'], ['PRS', 'Passenger Reservation System'], ['UTS', 'Unreserved Ticketing System'], ['TTE', 'Travelling Ticket Examiner'], ['RAC', 'Reservation Against Cancellation'], ['RPF', 'Railway Protection Force'], ['GRP', 'Government Railway Police'], ['TC', 'Ticket Collector'], ['SM', 'Station Master'], ['DRM', 'Divisional Railway Manager']]],
    ['h', 'Safety and signals'],
    ['ul', ['Red signal: stop. Yellow: caution, be ready to stop. Green: proceed', 'RPF protects railway property and passengers; GRP is the state police force for crime on railways', 'Station Master controls train movement in a station section; the Guard rides at the rear of a train']],
  ],
}
const ACCOUNTS = {
  id: 'acct', title: 'Accounts and office basics', b: [
    ['h', 'Why this matters'],
    ['ul', ['Not part of the CBT. It helps for the Accounts Clerk and Commercial Clerk roles and for any interview or training that follows.']],
    ['h', 'Core ideas'],
    ['ul', ['Accounting equation: Assets = Liabilities + Capital', 'Double entry: every transaction has a debit and a credit of equal value', 'Personal account: debit the receiver, credit the giver. Real account: debit what comes in, credit what goes out. Nominal account: debit expenses and losses, credit incomes and gains', 'Cash book records cash and bank receipts and payments; journal records transactions first; ledger groups them by account; trial balance checks that debits equal credits', 'Straight-line depreciation = (cost − scrap value) ÷ useful life', 'GST: CGST and SGST are charged on sales within a state; IGST is charged on sales between states']],
    ['table', [['Term', 'Meaning'], ['Asset', 'Something the business owns'], ['Liability', 'Something the business owes'], ['Capital', "The owner's investment"], ['Revenue', 'Income from normal operations'], ['Expense', 'Cost of running the business'], ['Debit', 'Left side of an account'], ['Credit', 'Right side of an account']]],
  ],
}
const TYPING = {
  id: 'type', title: 'Typing sheet', b: [
    ['h', 'Speed maths'],
    ['ul', ['One word = 5 keystrokes (spaces count)', 'Gross WPM = (total keystrokes ÷ 5) ÷ minutes', 'Net WPM = gross WPM − (uncorrected errors ÷ minutes)', 'Accuracy % = correct keystrokes ÷ total keystrokes × 100', 'Targets in recent notices: 30 wpm English, 25 wpm Hindi. Confirm in the current notice']],
    ['h', 'Technique'],
    ['ul', ['Rest index fingers on F and J, where the small bumps are', 'Use the opposite hand for Shift, and your thumb for the space bar', 'Look at the screen, not the keys', 'Aim for accuracy above 95% first; speed follows', 'Hindi Inscript: vowels sit under the left hand, consonants under the right']],
    ['table', [['Term', 'Meaning'], ['Home row', 'ASDF and JKL; keys'], ['Keystroke', 'One key press'], ['Gross speed', 'Speed before subtracting errors'], ['Net speed', 'Speed after subtracting errors'], ['Backspace', 'Deletes the previous character'], ['Inscript', 'Standard Indian-language keyboard layout']]],
  ],
}
const insert = (list, after, extra) => { const i = list.findIndex((n) => n.id === after); return [...list.slice(0, i + 1), ...extra, ...list.slice(i + 1)] }
export const NOTES = insert(G, 'rail', [COMMERCIAL, ACCOUNTS, TYPING])
