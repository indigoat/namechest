import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { AppShell } from '../components/AppShell'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
})

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft">
      <h1 className="font-brand text-xl">Page not found</h1>
      <p className="mt-2 text-brand-muted">The page you are looking for does not exist.</p>
    </div>
  ),
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}
