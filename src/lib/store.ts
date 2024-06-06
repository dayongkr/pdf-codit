import type { PDFPageProxy } from 'pdfjs-dist'
import { create } from 'zustand'

interface pdfState {
  pages: PDFPageProxy[]
  currentPage: number
  setPages: (pages: PDFPageProxy[]) => void
  setCurrentPage: (currentPage: number) => void
  incrementPage: () => void
  decrementPage: () => void
}

export const pdfStore = create<pdfState>((set) => ({
  pages: [],
  currentPage: 1,
  setPages: (pages) => {
    set({ pages })
  },
  setCurrentPage: (currentPage) => {
    set({ currentPage })
  },
  incrementPage: () => {
    set((state) => ({ currentPage: state.currentPage + 1 }))
  },
  decrementPage: () => {
    set((state) => ({ currentPage: state.currentPage - 1 }))
  }
}))
