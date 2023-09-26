import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MedStudySign',
  description: 'MedStudySign.ai is a web platform that simplifies patient enrollment in medical studies. Clinicians can upload consent forms, enter patient emails, use Dropbox for signatures, and summarize documents with a Language Model. It notifies clinicians once patients sign the document.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
