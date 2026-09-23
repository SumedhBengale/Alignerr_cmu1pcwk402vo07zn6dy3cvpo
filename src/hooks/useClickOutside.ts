import { useEffect, type RefObject } from 'react'

/**
 * Invokes `onOutsideClick` when a mousedown lands outside the referenced element.
 * Pass `enabled` to arm the listener only while a popover/menu is open.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, onOutsideClick, enabled])
}