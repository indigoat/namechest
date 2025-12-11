interface UsernameChipProps {
  username: string
  onRemove?: (username: string) => void
}

export function UsernameChip({ username, onRemove }: UsernameChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-accent/10 px-3 py-1.5 text-sm font-medium text-brand-accent">
      <span>{username}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(username)}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-brand-accent/20"
          type="button"
          aria-label={`Remove ${username}`}
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
