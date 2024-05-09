// Function to wait for a given number of milliseconds
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function simulating a retry connection attempt with exponential backoff and full jitter
async function connectWithBackoff(maxAttempts: number, baseDelay: number, maxDelay: number): Promise<void> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const delayTime = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        const jitter = Math.random() * delayTime;  // Full jitter

        try {
            console.log(`Attempt ${attempt + 1}: Retrying in ${jitter.toFixed(0)} ms`);
            await delay(jitter);
            // Simulate a connection attempt here
            if (Math.random() > 0.5) {  // Assume a 50% chance of success
                console.log("Connected successfully!");
                return;
            }
        } catch (error) {
            console.error("Connection attempt failed", error);
        }
    }
    console.log("Failed to connect after maximum attempts.");
}

// Example usage
connectWithBackoff(5, 100, 10000);  // maxAttempts, baseDelay (ms), maxDelay (ms)
