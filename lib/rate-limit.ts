interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.store = new Map();
    this.startCleanup();
  }

  private startCleanup() {
    // Dọn dẹp các entry đã hết hạn mỗi 5 phút
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000); // 5 phút
  }

  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): { success: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Tạo entry mới hoặc reset entry đã hết hạn
      const resetTime = now + windowMs;
      this.store.set(identifier, {
        count: 1,
        resetTime,
      });

      return {
        success: true,
        remaining: limit - 1,
        reset: resetTime,
      };
    }

    // Entry còn hiệu lực
    if (entry.count < limit) {
      entry.count++;
      return {
        success: true,
        remaining: limit - entry.count,
        reset: entry.resetTime,
      };
    }

    // Vượt quá giới hạn
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Export các limiter instances
export const authLimiter = new RateLimiter();
export const apiLimiter = new RateLimiter();
