import { AlertTriangle } from 'lucide-react'
import { PlaceholderView } from './PlaceholderView'

export function IncidentsView() {
  return (
    <PlaceholderView
      title="Incident history"
      description="Reviewed incidents with timeline, severity, and resolution notes."
      icon={AlertTriangle}
    />
  )
}