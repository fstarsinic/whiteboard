type JitterType = "none" | "full" | "equal" | "decorrelated";

class ExponentialBackoff {
    private baseDelay: number;
    private maxDelay: number;
    private jitterType: JitterType;

    constructor(baseDelay: number = 100, maxDelay: number = 10000, jitterType: JitterType = "full") {
        this.baseDelay = baseDelay;
        this.maxDelay = maxDelay;
        this.jitterType = jitterType;
    }

    // Calculate the next delay based on the attempt number and jitter type
    calculateDelay(attempt: number): number {
        const expDelay = Math.min(this.baseDelay * Math.pow(2, attempt), this.maxDelay);
        switch (this.jitterType) {
            case "full":
                return Math.random() * expDelay;
            case "equal":
                const halfExpDelay = expDelay / 2;
                return halfExpDelay + (Math.random() * halfExpDelay);
            case "decorrelated":
                return Math.min(this.baseDelay, Math.random() * expDelay * 3);
            case "none":
            default:
                return expDelay;
        }
    }
}

// Function to simulate delay
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Example usage of the class
async function retryOperation(maxAttempts: number, backoff: ExponentialBackoff): Promise<void> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const waitTime = backoff.calculateDelay(attempt);
        console.log(`Attempt ${attempt + 1}: Waiting for ${waitTime.toFixed(0)} ms before retrying...`);
        await delay(waitTime);

        // Here you would place your retry logic, e.g., trying to connect to a service
        if (Math.random() > 0.5) {  // Simulating a 50% chance of success
            console.log("Operation successful!");
            return;
        }
    }
    console.log("Failed to complete operation after maximum attempts.");
}

// Creating an instance of ExponentialBackoff with full jitter
const backoff = new ExponentialBackoff(100, 5000, "full");
retryOperation(5, backoff);
