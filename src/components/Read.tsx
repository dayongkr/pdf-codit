'use client'

import * as pdfjs from 'pdfjs-dist'
import 'pdfjs-dist/webpack'
import { useEffect, useRef } from 'react'

const getPDF = async () => {
  try {
    const loadingTask = pdfjs.getDocument('./pa.pdf')
    const pdf = await loadingTask.promise
    console.log('PDF loaded')
    return pdf
  } catch (error) {
    console.log('Error loading PDF:', error)
  }
}

const renderPDF = async (
  pdf: pdfjs.PDFDocumentProxy,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  try {
    const page = await pdf.getPage(1)
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('Canvas not found')
      return
    }
    const context = canvas.getContext('2d')

    if (!context) {
      console.log('Canvas context not found')
      return
    }

    const viewport = page.getViewport({ scale: 1 })
    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }

    await page.render(renderContext).promise
    console.log('PDF rendered')
  } catch (error) {
    console.log('Error rendering PDF:', error)
  }
}

export default function Read() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    getPDF().then((pdf) => {
      if (pdf) renderPDF(pdf, canvasRef)
    })
  }, [])
  return <canvas id="pdf" width="800" height="600" ref={canvasRef} />
}
