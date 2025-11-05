import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FiveM Faction Panel - Comando Tatico',
  description: 'Painel Futurista de Gerenciamento de Faccao FiveM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark-bg text-gray-100 font-exo">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1C2128',
              color: '#E6EDF3',
              border: '1px solid #00F0FF',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#00FF94',
                secondary: '#1C2128',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF0055',
                secondary: '#1C2128',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
