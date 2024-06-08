'use client'

import PdfCanvas from '@/components/PdfCanvas'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { pdfStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  ShadowInnerIcon
} from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const scrollToPreview = (
  previewRef: React.RefObject<HTMLDivElement>,
  index: number
) => {
  previewRef.current?.scrollTo({
    top: previewRef.current?.children[index].getBoundingClientRect().top,
    behavior: 'instant'
  })
}

export default function Viewerpage() {
  const previewRef = useRef<HTMLDivElement>(null)
  const { pages, currentPage, setCurrentPage, incrementPage, decrementPage } =
    pdfStore()
  const router = useRouter()

  useEffect(() => {
    if (!pages.length) {
      // If there are no pages, redirect to the home page
      router.push('/')
    }
  }, [pages, router])

  return (
    <div className="flex h-full w-full">
      <div
        className="flex w-1/3 flex-col gap-3 overflow-auto p-5 hover:cursor-pointer"
        ref={previewRef}
      >
        {pages.map((page, index) => (
          <Card
            key={index}
            className={cn('p-3', currentPage === index + 1 && 'border-primary')}
            onClick={() => setCurrentPage(index + 1)}
          >
            <PdfCanvas page={page} preview />
          </Card>
        ))}
      </div>
      <div className="flex h-full w-full flex-col">
        <header className="relative flex w-full items-center justify-center gap-3 border-b-2 border-b-secondary p-2">
          <Button
            className="absolute left-5"
            variant="outline"
            size="icon"
            onClick={() => router.push('/')}
          >
            <HomeIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              decrementPage()
              scrollToPreview(previewRef, currentPage - 2)
            }}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon />
          </Button>
          <span className="text-primary">{currentPage}</span>
          <span className="text-secondary-foreground opacity-50">
            {' '}
            of {pages.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              incrementPage()
              scrollToPreview(previewRef, currentPage)
            }}
            disabled={currentPage === pages.length}
          >
            <ArrowRightIcon />
          </Button>
        </header>
        <div className="flex h-full w-full items-center justify-start overflow-auto p-3">
          <PdfCanvas page={pages[currentPage - 1]} />
        </div>
      </div>
    </div>
  )
}
