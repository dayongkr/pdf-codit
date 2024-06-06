import type { PDFPageProxy } from 'pdfjs-dist'
import { useEffect, useRef } from 'react'

const renderPDF = async (
  page: PDFPageProxy,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  preview: boolean
) => {
  try {
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

    const viewport = page.getViewport({ scale: preview ? 0.5 : 1.5 })
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

export default function PdfCanvas({
  page,
  preview = false
}: {
  page: PDFPageProxy
  preview?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    renderPDF(page, canvasRef, preview)
  }, [page, canvasRef, preview])

  return <canvas ref={canvasRef} className="m-auto w-full" />
}
