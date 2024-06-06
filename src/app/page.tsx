'use client'

import { useState, type DragEvent } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { UploadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { pdfStore } from '@/lib/store'
import type { PdfState } from '@/lib/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { PDFPageProxy } from 'pdfjs-dist'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const getPDF = async (dataURL: string) => {
  // Promise.withResolver is not supported in the node.js LTS version(20.x), so we use only in the client side
  const pdfjs = await import('pdfjs-dist')
  await import('pdfjs-dist/webpack.mjs')

  const loadingTask = pdfjs.getDocument({
    url: dataURL,
    // For supporting non-ASCII characters
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true
  })

  return await loadingTask.promise
}

const viewFile = (
  file: File,
  router: AppRouterInstance,
  setPages: PdfState['setPages'],
  setCurrentPage: PdfState['setCurrentPage']
) => {
  const reader = new FileReader()

  reader.onload = async function (e: ProgressEvent<FileReader>) {
    if (typeof e.target?.result !== 'string')
      throw new Error('This file is not valid.')

    // Get the PDF document by 'pdfjs-dist'
    const pdf = await getPDF(e.target.result)
    if (!pdf) throw new Error('This file is not valid.')

    // Store the pages in the global state
    const pagesList: PDFPageProxy[] = []
    for (let i = 1; i <= pdf.numPages; i++) {
      pagesList.push(await pdf.getPage(i))
    }
    setPages(pagesList)
    setCurrentPage(1)

    // Redirect to the viewer page after reading the file
    router.push('/viewer')
  }

  reader.readAsDataURL(file)
}

const getFile = (dataTransferItemList: DataTransferItemList) => {
  if (dataTransferItemList.length > 1)
    throw new Error('Please drop only one file.')

  const dataTransferItem = dataTransferItemList[0]
  if (
    dataTransferItem.kind !== 'file' ||
    dataTransferItem.type !== 'application/pdf'
  )
    throw new Error(`Please drop a PDF file.`)

  const file = dataTransferItem.getAsFile()
  if (!file) throw new Error('This file is not valid.')

  return file
}

const dropHandler = (
  e: DragEvent<HTMLDivElement>,
  router: AppRouterInstance,
  setPages: PdfState['setPages'],
  setCurrentPage: PdfState['setCurrentPage'],
  setHover: (hover: boolean) => void
) => {
  e.preventDefault()
  try {
    const file = getFile(e.dataTransfer.items)
    viewFile(file, router, setPages, setCurrentPage)
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
      setHover(false)
    }
  }
}

export default function Home() {
  const [hover, setHover] = useState(false)
  const router = useRouter()
  const { setPages, setCurrentPage } = pdfStore()

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>PDF Viewer</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Upload a your PDF file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'flex items-center justify-center gap-3 rounded-lg border-2 border-dotted border-muted-foreground p-5 text-sm text-muted-foreground',
              hover && 'border-primary bg-primary-foreground text-primary'
            )}
            onDrop={(e) =>
              dropHandler(e, router, setPages, setCurrentPage, setHover)
            }
            onDragOver={(e) => {
              e.preventDefault()
              if (e.dataTransfer.items[0].kind === 'file') setHover(true)
            }}
            onDragLeave={() => setHover(false)}
          >
            <UploadIcon />
            Drag & Drop your files here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
