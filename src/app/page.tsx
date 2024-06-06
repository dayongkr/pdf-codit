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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { PDFPageProxy } from 'pdfjs-dist'

const getPDF = async (dataURL: string) => {
  try {
    const pdfjs = await import('pdfjs-dist')
    await import('pdfjs-dist/webpack.mjs')
    const loadingTask = pdfjs.getDocument({
      url: dataURL,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true
    })
    return await loadingTask.promise
  } catch (error) {
    console.log('Error loading PDF:', error)
  }
}

export default function Home() {
  const [hover, setHover] = useState(false)
  const router = useRouter()
  const { setPages, setCurrentPage } = pdfStore()

  function readPDF(file: File) {
    const reader = new FileReader()
    reader.onload = async function (e: ProgressEvent<FileReader>) {
      if (typeof e.target?.result !== 'string')
        throw new Error('This file is not valid.')

      const pdf = await getPDF(e.target.result)
      if (!pdf) throw new Error('This file is not valid.')
      const pagesList: PDFPageProxy[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        pagesList.push(page)
      }
      setPages(pagesList)
      setCurrentPage(1)
      router.push('/viewer')
    }
    reader.readAsDataURL(file)
  }

  function dropHandler(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const dataTranferItemList = e.dataTransfer.items
    try {
      if (dataTranferItemList) {
        if (dataTranferItemList.length > 1)
          throw new Error('Please drop only one file.')

        const dataTransferItem = dataTranferItemList[0]
        if (
          dataTransferItem.kind !== 'file' ||
          dataTransferItem.type !== 'application/pdf'
        )
          throw new Error(`Please drop a PDF file.`)

        const file = dataTransferItem.getAsFile()
        if (!file) throw new Error('This file is not valid.')

        readPDF(file)
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
      setHover(false)
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>PDF Viewer</CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Upload a your PDF file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'flex items-center justify-center gap-3 rounded-lg border-2 border-dotted border-gray-400 bg-secondary p-5 text-sm text-gray-400',
              hover && 'border-primary text-primary'
            )}
            onDrop={dropHandler}
            onDragOver={(e) => {
              e.preventDefault()
              const dataTranferItemList = e.dataTransfer.items
              if (dataTranferItemList[0].kind === 'file') setHover(true)
              else setHover(false)
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
