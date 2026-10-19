import maths1 from './maths-1.js'
import maths2 from './maths-2.js'
import maths3 from './maths-3.js'
import reasoning from './reasoning.js'
import ga1 from './ga-1.js'
import ga2 from './ga-2.js'
import ga3 from './ga-3.js'

// One big text. The site parses it into lessons keyed by "Topic :: Sub-topic".
export default [maths1, maths2, maths3, reasoning, ga1, ga2, ga3].join('\n')
