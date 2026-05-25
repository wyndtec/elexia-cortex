import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/ui/Sidebar'
import { DashboardPage } from './pages/DashboardPage'
import { CustomerProfilePage } from './pages/CustomerProfilePage'
import { ConnectorsPage } from './pages/ConnectorsPage'
import { IntelligencePage } from './pages/IntelligencePage'
import { CompliancePage } from './pages/CompliancePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-bg-base overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/customer/:id" element={<CustomerProfilePage />} />
            <Route path="/connectors" element={<ConnectorsPage />} />
            <Route path="/intelligence" element={<IntelligencePage />} />
            <Route path="/compliance" element={<CompliancePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
