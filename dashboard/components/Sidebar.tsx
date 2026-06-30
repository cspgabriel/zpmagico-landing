interface SidebarProps {
  currentPage: string
  onPageChange: (page: any) => void
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'instances', label: 'Instâncias', icon: '📱' },
    { id: 'integrations', label: 'Integrações', icon: '🔗' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-600">Evolution</h1>
        <p className="text-xs text-gray-500 mt-1">Dashboard Manager</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors ${
              currentPage === item.id
                ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-700">
          <p className="font-semibold">Versão 1.0</p>
          <p className="text-xs mt-2">API management ready</p>
        </div>
      </div>
    </aside>
  )
}
