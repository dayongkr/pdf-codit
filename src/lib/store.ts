import { create } from 'zustand'

interface pdfState {
  pdf: string
  setPdf: (pdf: string) => void
}

export const pdfStore = create<pdfState>((set) => ({
  pdf: '',
  setPdf: (pdf) => set({ pdf })
}))
