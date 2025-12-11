# Availability Check API

This document describes the mock availability checking service for usernames and domains.

## Overview

The service provides deterministic availability checks for usernames across social platforms and domain TLDs. All results are generated using a hash-based algorithm, ensuring consistent results for the same input.

## Service Location

- **Service**: `/app/services/mockAvailability.ts`
- **API Route**: `/app/routes/api/check-availability.ts`
- **Models**: `/app/models/types.ts`
- **Tests/Fixtures**: `/app/services/__tests__/mockAvailability.test.ts`

## Types

### SocialPlatform
Supported platforms: `twitter`, `instagram`, `tiktok`, `linkedin`, `github`, `youtube`, `twitch`, `discord`, `reddit`, `medium`

### DomainTLD
Supported TLDs: `.com`, `.net`, `.org`, `.io`, `.co`, `.dev`

### AvailabilityCheckResult
```typescript
interface AvailabilityCheckResult {
  username: string
  platforms: Record<SocialPlatform, boolean>
  domains: Record<DomainTLD, boolean>
  checkedAt: string  // ISO 8601 timestamp
}
```

### CheckAvailabilityRequest
```typescript
interface CheckAvailabilityRequest {
  usernames: string[]
}
```

### CheckAvailabilityResponse
```typescript
interface CheckAvailabilityResponse {
  results: AvailabilityCheckResult[]
  error?: string
  responseTime: number  // milliseconds
}
```

## API Usage

### POST /api/check-availability

Send a request with an array of usernames:

```json
{
  "usernames": ["john", "jane", "bob"]
}
```

Response (on success):

```json
{
  "results": [
    {
      "username": "john",
      "platforms": {
        "twitter": true,
        "instagram": false,
        "tiktok": true,
        "linkedin": false,
        "github": true,
        "youtube": false,
        "twitch": true,
        "discord": false,
        "reddit": true,
        "medium": false
      },
      "domains": {
        ".com": true,
        ".net": false,
        ".org": true,
        ".io": false,
        ".co": true,
        ".dev": false
      },
      "checkedAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "responseTime": 45.5
}
```

Response (on error):

```json
{
  "results": [],
  "error": "At least one username is required",
  "responseTime": 0.2
}
```

## Behavior

### Deterministic Results
- Results are deterministic based on the username
- Same username always returns the same availability
- Different usernames will have different (but consistent) results

### Case Handling
- Usernames are normalized to lowercase
- Case-insensitive deduplication
- Leading/trailing whitespace is trimmed

### Validation
- Maximum 100 usernames per request
- Empty strings and whitespace-only strings are filtered
- Non-array inputs are rejected with an error

### Reserved Names
Certain platform-specific names are always marked as unavailable:
- **Twitter**: twitter, support, status, help, blog, developer
- **Instagram**: instagram, support, about, explore, help
- **TikTok**: tiktok, support, explore, discover
- **LinkedIn**: linkedin, jobs, help, about, safety
- **GitHub**: github, support, about, github-community, github-support
- **YouTube**: youtube, user, channel, watch, results
- **Twitch**: twitch, directory, help, jobs, brand
- **Discord**: discord, support, help, developers, hypesquad
- **Reddit**: reddit, help, announcements, mods, redditmobile
- **Medium**: medium, support, help, trending, about

### Domain Requirements
- Domains require usernames of at least 2 characters
- Single-character usernames will have all domains marked as unavailable

### Latency Simulation
- Optional simulated latency (50-200ms) can be enabled for realistic testing
- Controlled via the `simulateLatency` parameter in `checkAvailability()`

## Implementation Details

### Hash-Based Algorithm
The service uses a simple hash function that:
1. Normalizes the username to lowercase
2. Computes a deterministic hash value
3. Maps the hash to availability based on platform/TLD biases

Each platform and TLD has a different probability distribution:
- **High availability**: Discord (60%), TikTok (50%), Reddit (50%), YouTube (45%), .dev (45%), .io (30%)
- **Medium availability**: Instagram (40%), Medium (40%), .net (40%), LinkedIn (35%), .co (35%)
- **Low availability**: Twitter (30%), GitHub (25%), .com (20%)

### Deduplication
Duplicate usernames (including different cases) are deduplicated before processing. Only unique normalized usernames are returned in the results.

## Testing

The service includes comprehensive test fixtures covering:
- Basic functionality (single/multiple usernames, all platforms/TLDs)
- Deterministic behavior (consistency, case-insensitivity, whitespace trimming)
- Duplicate handling
- Edge cases (empty input, invalid input, reserved names, short usernames)
- Timestamp validation
- Response time measurement
- Response structure validation

Run fixtures by importing and executing the test module.
