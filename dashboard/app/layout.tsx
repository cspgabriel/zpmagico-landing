import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Evolution Dashboard',
  description: 'Gestão centralizada: Evolution API + Dify + Typebot + Chatwoot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
