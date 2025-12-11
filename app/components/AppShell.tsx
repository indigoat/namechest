import { Link } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh text-brand-fg">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-10 border-b border-brand-border/70 bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:py-4">
          <Link to="/" className="group inline-flex items-baseline gap-0.5 font-brand text-base tracking-tight sm:text-lg">
            <span className="text-brand-accent">name</span>
            <span>check</span>
          </Link>

          <a
            href="https://namecheck.com"
            className="text-xs font-medium text-brand-muted transition hover:text-brand-fg sm:text-sm"
            rel="noreferrer"
            target="_blank"
          >
            namecheck.com
          </a>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8 lg:py-10">{children}</main>

      <footer className="border-t border-brand-border/70">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between sm:py-8 sm:text-sm">
          <span>Built with TanStack + Tailwind</span>
          <span>© {new Date().getFullYear()} namecheck</span>
        </div>
      </footer>
    </div>
  )
}
