import {
  AlertTriangle,
  LayoutDashboard,
  Rocket,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export type View = 'dashboard' | 'deployments' | 'incidents' | 'settings'

export interface NavItem {
  id: View
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'deployments', label: 'Deployments', icon: Rocket },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export const VIEW_TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  deployments: 'Deployments',
  incidents: 'Incidents',
  settings: 'Settings',
}

export interface Team {
  id: string
  name: string
  slug: string
  initials: string
}

export const TEAMS: Team[] = [
  { id: 'core', name: 'Core Platform', slug: 'core-platform', initials: 'CP' },
  { id: 'web', name: 'Web Experience', slug: 'web-experience', initials: 'WE' },
  { id: 'data', name: 'Data & ML', slug: 'data-ml', initials: 'DM' },
]

export const CURRENT_USER = {
  name: 'Amara Osei',
  email: 'amara.osei@acmesystems.dev',
  initials: 'AO',
  role: 'Staff Engineer',
}