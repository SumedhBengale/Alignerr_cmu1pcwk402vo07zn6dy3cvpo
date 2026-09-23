import { Settings } from 'lucide-react'
import { PlaceholderView } from './PlaceholderView'

export function SettingsView() {
  return (
    <PlaceholderView
      title="Workspace settings"
      description="Team configuration, notification rules, and integrations."
      icon={Settings}
    />
  )
}