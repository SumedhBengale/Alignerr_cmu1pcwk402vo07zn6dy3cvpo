import type { LucideIcon } from 'lucide-react'
import { ViewPlaceholder } from '../components/ui/ViewPlaceholder'

interface PlaceholderViewProps {
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderView({ title, description, icon }: PlaceholderViewProps) {
  return <ViewPlaceholder title={title} description={description} icon={icon} />
}