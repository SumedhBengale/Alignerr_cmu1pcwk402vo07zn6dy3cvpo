import { useState } from 'react'
import { MobileNav } from './components/layout/MobileNav'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { TEAMS, type Team, type View } from './lib/navigation'
import { DashboardView } from './views/DashboardView'
import { DeploymentsView } from './views/DeploymentsView'
import { IncidentsView } from './views/IncidentsView'
import { SettingsView } from './views/SettingsView'

const INITIAL_VIEW: View = 'dashboard'

export default function App() {
  const [view, setView] = useState<View>(INITIAL_VIEW)
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [team, setTeam] = useState<Team>(TEAMS[0])

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView team={team} />
      case 'deployments':
        return <DeploymentsView />
      case 'incidents':
        return <IncidentsView />
      case 'settings':
        return <SettingsView />
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        view={view}
        collapsed={collapsed}
        team={team}
        onNavigate={setView}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        onSelectTeam={setTeam}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar view={view} team={team} onOpenMobileNav={() => setMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">{renderView()}</div>
        </main>
      </div>

      <MobileNav
        open={menuOpen}
        view={view}
        team={team}
        onClose={() => setMenuOpen(false)}
        onNavigate={setView}
        onSelectTeam={setTeam}
      />
    </div>
  )
}