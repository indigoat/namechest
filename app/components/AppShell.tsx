import { Link } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh bg-brand-bg text-brand-fg">
      <header className="sticky top-0 z-10 border-b border-brand-border/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="group inline-flex items-baseline gap-0.5 font-brand text-lg tracking-tight">
            <span className="text-brand-accent">name</span>
            <span>check</span>
          </Link>

          <a
            href="https://namecheck.com"
            className="text-sm font-medium text-brand-muted transition hover:text-brand-fg"
            rel="noreferrer"
            target="_blank"
          >
            namecheck.com
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>

      <footer className="border-t border-brand-border/70">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-8 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Built with TanStack + Tailwind</span>
          <span>© {new Date().getFullYear()} namecheck</span>
        </div>
      </footer>
    </div>
  )
}
