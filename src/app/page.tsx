'use client'

import type { DragEvent } from 'react'
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

export default function Home() {
  const router = useRouter()
  const { setPdf } = pdfStore()

  function readPDF(file: File, callback: (pdf: string) => void) {
    const reader = new FileReader()
    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (typeof e.target?.result !== 'string')
        throw new Error('This file is not valid.')
      callback(e.target.result)
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

        readPDF(file, setPdf)
        router.push('/viewer')
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>PDF Viewer</CardTitle>
        <CardDescription className="text-xs text-gray-400">
          Upload a your PDF file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex items-center justify-center gap-3 rounded-lg border-2 border-dotted border-gray-400 bg-gray-50 p-5 text-sm text-gray-400"
          onDrop={dropHandler}
          onDragOver={(e) => {
            e.preventDefault()
          }}
        >
          <UploadIcon />
          Drag & Drop your files here.
        </div>
      </CardContent>
    </Card>
  )
}
