import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDisplayEmail(email: string) {
  return email.split('@')[0]
}

export function formatDate(iso: string | null): string {
  if (!iso) return '-'

  const date = new Date(iso)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${month}월 ${day}일 ${hour}:${minute}`
}

export function formatSmartDate(iso: string): string {

  const date = new Date(iso)
  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  if (isToday) return `${hour}:${minute}`

  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}월 ${day}일 ${hour}:${minute}`
}