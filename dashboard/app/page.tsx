'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import Instances from '@/components/Instances'
import Integrations from '@/components/Integrations'
import Settings from '@/components/Settings'

type Page = 'dashboard' | 'instances' | 'integrations' | 'settings'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [apiUrl, setApiUrl] = useState('http://localhost:8083')

  useEffect(() => {
    const saved = localStorage.getItem('evolutionApiUrl')
    if (saved) setApiUrl(saved)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'instances':
        return <Instances apiUrl={apiUrl} />
      case 'integrations':
        return <Integrations apiUrl={apiUrl} />
      case 'settings':
        return <Settings apiUrl={apiUrl} onApiUrlChange={setApiUrl} />
      default:
        return <Dashboard apiUrl={apiUrl} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}
