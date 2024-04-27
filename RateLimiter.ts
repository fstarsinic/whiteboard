class RateLimiter {
    private timeWindow: number; // Time window in milliseconds
    private maxRequests: number; // Maximum requests allowed in the time window
    private requestCount: number; // Current request count
    private lastReset: number; // Last reset time

    constructor(timeWindow: number, maxRequests: number) {
        this.timeWindow = timeWindow;
        this.maxRequests = maxRequests;
        this.requestCount = 0; // Initialize request count
        this.lastReset = Date.now(); // Set the initial reset time
    }

    // Method to check if a request is allowed
    isRequestAllowed(): boolean {
        const currentTime = Date.now();

        // Check if the time window has passed
        if (currentTime - this.lastReset >= this.timeWindow) {
            this.requestCount = 0; // Reset the request count
            this.lastReset = currentTime; // Update the reset time
        }

        if (this.requestCount < this.maxRequests) {
            this.requestCount++; // Increment the request count
            return true; // Request is allowed
        }

        return false; // Request is not allowed
    }
}



class RateLimiter {
    private static instance: RateLimiter | null = null; // Singleton instance
    private timeWindow: number; // Time window in milliseconds
    private maxRequests: number; // Maximum requests allowed in the time window
    private requestCount: number; // Current request count
    private lastReset: number; // Last reset time

    // Private constructor to prevent external instantiation
    private constructor(timeWindow: number, maxRequests: number) {
        this.timeWindow = timeWindow;
        this.maxRequests = maxRequests;
        this.requestCount = 0; // Initialize request count
        this.lastReset = Date.now(); // Set the initial reset time
    }

    // Static method to get the singleton instance
    public static getInstance(timeWindow: number, maxRequests: number): RateLimiter {
        if (RateLimiter.instance === null) {
            // Create the singleton instance if it doesn't exist
            RateLimiter.instance = new RateLimiter(timeWindow, maxRequests);
        }
        return RateLimiter.instance; // Return the singleton instance
    }

    // Method to check if a request is allowed
    public isRequestAllowed(): boolean {
        const currentTime = Date.now();

        // Check if more than one second has passed
        if (currentTime - this.lastReset >= this.timeWindow) {
            this.requestCount = 0; // Reset the request count
            this.lastReset = currentTime; // Update the reset time
        }

        if (this.requestCount < this.maxRequests) {
            this.requestCount++; // Increment the request count
            return true; // Request is allowed
        }

        return false; // Request is not allowed
    }
}
