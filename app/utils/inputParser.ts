export function parseUsernamesFromInput(input: string): string[] {
  if (!input.trim()) return []

  const separators = /[,\n]+/
  const rawUsernames = input.split(separators)

  const uniqueUsernames = Array.from(
    new Set(rawUsernames.map((u) => u.trim()).filter((u) => u.length > 0)),
  )

  return uniqueUsernames
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username.trim()) {
    return { valid: false, error: 'Username cannot be empty' }
  }

  if (username.trim().length < 2) {
    return { valid: false, error: 'Username must be at least 2 characters' }
  }

  if (username.length > 50) {
    return { valid: false, error: 'Username must be less than 50 characters' }
  }

  return { valid: true }
}

export function validateUsernames(usernames: string[]): {
  valid: boolean
  errors: string[]
  validUsernames: string[]
} {
  if (usernames.length === 0) {
    return {
      valid: false,
      errors: ['Please enter at least one username'],
      validUsernames: [],
    }
  }

  if (usernames.length > 100) {
    return {
      valid: false,
      errors: ['Maximum 100 usernames allowed'],
      validUsernames: [],
    }
  }

  const errors: string[] = []
  const validUsernames: string[] = []

  usernames.forEach((username) => {
    const validation = validateUsername(username)
    if (validation.valid) {
      validUsernames.push(username)
    } else if (validation.error) {
      errors.push(`"${username}": ${validation.error}`)
    }
  })

  return {
    valid: validUsernames.length > 0 && errors.length === 0,
    errors,
    validUsernames,
  }
}
