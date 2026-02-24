export interface BungieSuggestResult {
  displayName: string;
  displayNameCode: number;
  membershipId: string;
  membershipType: number;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class TtlCache<T> {
  private readonly map = new Map<string, CacheEntry<T>>();
  private readonly ttlMs: number;
  private readonly maxSize: number;

  constructor(ttlMs: number, maxSize = 200) {
    this.ttlMs = ttlMs;
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return null;
    }
    // Move to end for LRU eviction
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.data;
  }

  set(key: string, data: T): void {
    if (this.map.size >= this.maxSize) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) this.map.delete(firstKey);
    }
    this.map.set(key, { data, expiresAt: Date.now() + this.ttlMs });
  }
}

class RateLimiter {
  private readonly map = new Map<string, { count: number; windowStart: number }>();
  private readonly maxCalls: number;
  private readonly windowMs: number;

  constructor(maxCalls: number, windowMs: number) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.map.get(key);
    if (!entry || now - entry.windowStart > this.windowMs) {
      this.map.set(key, { count: 1, windowStart: now });
      return true;
    }
    if (entry.count >= this.maxCalls) return false;
    entry.count++;
    return true;
  }
}

// Cache Bungie global name results by lowercased prefix — 3 min TTL, up to 200 entries
export const bungieSearchCache = new TtlCache<BungieSuggestResult[]>(3 * 60 * 1000, 200);

// 10 Bungie API calls per minute per IP
export const bungieRateLimiter = new RateLimiter(10, 60 * 1000);
