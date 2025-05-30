import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'Manage your tasks efficiently',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 