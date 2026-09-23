import { LayoutDashboard } from 'lucide-react'
import { PlaceholderView } from './PlaceholderView'

export function DashboardView() {
  return (
    <PlaceholderView
      title="Dashboard overview"
      description="Key metrics, recent activity, and service health for the selected team."
      icon={LayoutDashboard}
    />
  )
}