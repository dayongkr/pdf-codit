import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Viewer',
  description: 'A simple PDF viewer'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container flex h-dvh items-center justify-center">
          <main>{children}</main>
          <Toaster richColors />
        </div>
      </body>
    </html>
  )
}
