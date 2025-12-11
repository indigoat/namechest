import { createRoute } from '@tanstack/react-router'

import { Route as RootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-brand text-3xl tracking-tight sm:text-4xl">Search experience</h1>
        <p className="max-w-prose text-brand-muted">
          This route is the default landing page and will host the domain/username search experience.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full flex-1">
            <label className="text-sm font-medium" htmlFor="query">
              Name to check
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-base outline-none ring-brand-accent/40 transition focus:ring-4"
              id="query"
              placeholder="Type a name…"
              type="text"
            />
          </div>

          <button
            className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-accent px-5 font-medium text-white shadow-soft transition hover:brightness-110"
            type="button"
          >
            Search
          </button>
        </div>

        <p className="mt-4 text-sm text-brand-muted">
          Next: wire the search input up to the TanStack Start server functions.
        </p>
      </div>
    </div>
  )
}
