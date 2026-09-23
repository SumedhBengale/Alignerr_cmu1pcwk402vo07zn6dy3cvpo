import { Rocket } from 'lucide-react'
import { PlaceholderView } from './PlaceholderView'

export function DeploymentsView() {
  return (
    <PlaceholderView
      title="Deployment history"
      description="Track builds, rollouts, and rollbacks across every environment."
      icon={Rocket}
    />
  )
}