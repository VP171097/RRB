import { createContext, useContext } from 'react'

export const ExamCtx = createContext(null)
export const useExam = () => useContext(ExamCtx)
