class EventMediator {
    private listeners: Array<(state: Record<string, any>) => void>;
    private state: Record<string, any>;

    constructor() {
        this.listeners = [];
        this.state = {}; // Initialize an empty state
    }

    // Method to notify listeners about state changes
    notifyStateChange(module: string, updatedState: Record<string, any>) {
        this.state = { ...this.state, ...updatedState }; // Merge the new state with the existing state
        this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners
    }

    // Method to get the entire state or a specific key's value
    getState(key?: string): any {
        if (key) {
            return this.state[key]; // Return the value for a specific key
        }
        return this.state; // Return the entire state if no key is specified
    }

    // Method to add a listener for state changes
    addListener(listener: (state: Record<string, any>) => void) {
        this.listeners.push(listener);
    }
}
