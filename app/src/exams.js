import graduate from '../../RRB_Graduate/index.js'
import undergraduate from '../../RRB_UnderGraduate/index.js'
import groupd from '../../RRB_GroupD/index.js'
import { buildPlan } from './plan.js'
import { parseLessons, parseDrills } from './lessons.js'

// The three exams, in dropdown order. The first one is the default.
const RAW = [graduate, undergraduate, groupd]
export const EXAM_LIST = RAW.map((e) => ({ id: e.id, name: e.name }))
export const DEFAULT_EXAM = RAW[0].id

const cache = {}
export function loadExam(id) {
  const e = RAW.find((x) => x.id === id) || RAW[0]
  if (!cache[e.id]) {
    const p = buildPlan(e.plan)
    const quizCats = ['All', ...Array.from(new Set(e.quiz.map((x) => x.cat)))]
    cache[e.id] = {
      ...e, ...p,
      SYLLABUS: e.syllabus, NOTES: e.notes, TRICKS: e.tricks, QUIZ: e.quiz, QUIZ_CATS: quizCats, RES: e.resources, LESSONS: parseLessons(e.lessons || ''), DRILLS: parseDrills(e.drills || ''),
      sectionByLabel: Object.fromEntries(e.sections.map((s) => [s.label, s])),
    }
  }
  return cache[e.id]
}

// Hindi content packs load on demand. Graduate's pack is the base layer for every exam (the others reuse its lessons, tricks and quiz).
const HI = { graduate: () => import('../../RRB_Graduate/hi/index.js'), undergraduate: () => import('../../RRB_UnderGraduate/hi/index.js'), groupd: () => import('../../RRB_GroupD/hi/index.js') }
export const loadHiPacks = (id) => Promise.all([HI.graduate(), id === 'graduate' ? null : HI[id]?.()]).then((m) => m.filter(Boolean).map((x) => x.default))
