import { useRef, useState } from 'react'
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { CURRENT_USER, VIEW_TITLES, type Team, type View } from '../../lib/navigation'
import { useClickOutside } from '../../hooks/useClickOutside'
import { LogoMark } from '../ui/LogoMark'

interface NotificationItem {
  id: string
  title: string
  detail: string
  time: string
  unread: boolean
  tone: 'success' | 'warning' | 'info'
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Deploy failed on payments-api',
    detail: 'build #4821 — production',
    time: '12m ago',
    unread: true,
    tone: 'warning',
  },
  {
    id: 'n2',
    title: 'Weekly metrics report is ready',
    detail: 'Summary for Core Platform',
    time: '1h ago',
    unread: true,
    tone: 'info',
  },
  {
    id: 'n3',
    title: 'Search index v3.2 deployed',
    detail: 'production — success',
    time: '3h ago',
    unread: true,
    tone: 'success',
  },
  {
    id: 'n4',
    title: 'Error budget alert recovered',
    detail: 'checkout-v2 is back under threshold',
    time: 'Yesterday',
    unread: false,
    tone: 'info',
  },
]

const TONE_STYLES: Record<NotificationItem['tone'], string> = {
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  info: 'bg-indigo-100 text-indigo-600',
}

interface TopbarProps {
  view: View
  team: Team
  onOpenMobileNav: () => void
}

export function Topbar({ view, team, onOpenMobileNav }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [readAll, setReadAll] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen)
  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen)

  const unreadCount = readAll ? 0 : NOTIFICATIONS.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2.5">
        <LogoMark className="h-7 w-7 lg:hidden" />
        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <h1 className="truncate text-[15px] font-semibold text-slate-900">
            {VIEW_TITLES[view]}
          </h1>
          <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 md:inline">
            {team.name}
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, deploy records…"
            className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 lg:w-72"
          />
        </div>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <button
                  type="button"
                  onClick={() => setReadAll(true)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-b-0 ${
                      n.unread && !readAll ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${TONE_STYLES[n.tone]}`}
                    >
                      {n.tone === 'success' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : n.tone === 'warning' ? (
                        <Bell className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{n.title}</p>
                      <p className="truncate text-xs text-slate-500">{n.detail}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-label="Account menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-slate-100"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
              {CURRENT_USER.initials}
            </span>
            <ChevronDown
              className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {CURRENT_USER.name}
                </p>
                <p className="truncate text-xs text-slate-500">{CURRENT_USER.email}</p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <User className="h-4 w-4 shrink-0 text-slate-400" />
                  Your profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 shrink-0 text-slate-400" />
                  Preferences
                </button>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}