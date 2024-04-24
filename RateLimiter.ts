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
