import { createContext, useContext } from 'react'
export type Lang = 'it' | 'en'
export const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'it', toggle: () => {} })
export const useLang = () => useContext(LangContext)
