import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import type { PDFPageProxy } from 'pdfjs-dist'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

const renderPDF = async (
  page: PDFPageProxy,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  preview: boolean,
  router: AppRouterInstance
) => {
  try {
    const canvas = canvasRef.current
    if (!canvas) throw new Error('Canvas not found')

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas context not found')

    // Scale the PDF page to the canvas(0.5 for preview, 1.5 for full view)
    const viewport = page.getViewport({ scale: preview ? 0.5 : 1.5 })
    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }

    await page.render(renderContext).promise
  } catch (error) {
    if (error instanceof Error) toast.error(error.message)
    router.push('/')
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
  const router = useRouter()

  useEffect(() => {
    renderPDF(page, canvasRef, preview, router)
  }, [page, canvasRef, preview, router])

  return <canvas ref={canvasRef} className="m-auto w-full" />
}
