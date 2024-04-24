class Monitor {
    private rateLimiter: RateLimiter; // The rate limiter

    constructor(rateLimiter: RateLimiter) {
        this.rateLimiter = rateLimiter;
    }

    // Method to handle a cache update
    handleCacheUpdate() {
        if (this.rateLimiter.isRequestAllowed()) {
            console.log("Request is allowed. Updating cache...");

            // Cache update logic here
        } else {
            console.log("Request denied. Rate limit exceeded.");
        }
    }
}

// Set a rate limit of 100 requests per second
const rateLimiter = new RateLimiter(1000, 100); // 1000 ms time window, 100 max requests

const monitor = new Monitor(rateLimiter);

// Simulate requests
for (let i = 0; i < 200; i++) {
    monitor.handleCacheUpdate();
}

// Expected output:
// First 100 requests will be allowed, then the rest will be denied
