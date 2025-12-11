interface StatusBadgeProps {
  isAvailable: boolean
  label: string
  className?: string
}

export function StatusBadge({ isAvailable, label, className = '' }: StatusBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium ${
        isAvailable
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
      } ${className}`}
      aria-label={`${label}: ${isAvailable ? 'available' : 'taken'}`}
      role="status"
    >
      <svg
        className="h-3.5 w-3.5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {isAvailable ? (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        )}
      </svg>
      <span>{label}</span>
    </div>
  )
}
