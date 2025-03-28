import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Emojot | Email Template Creator',
  description: "Create responsive, customizable email templates with Emojot's drag-and-drop email template creator. Export clean HTML with dynamic variables for alerts, campaigns, and business workflows.",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="description" content="Created with v0" />
      </head>
      <body>{children}</body>
    </html>
  )
}

