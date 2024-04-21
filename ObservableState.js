class ObservableState {
    private state: Record<string, any>;
    private onChange: (newState: Record<string, any>) => void;

    constructor(initialState: Record<string, any>, onChange: (newState: Record<string, any>) => void) {
        this.state = initialState;
        this.onChange = onChange;
    }

    // Unified method for updating state (single or multiple key-value pairs)
    updateState(updates: Record<string, any>) {
        this.state = { ...this.state, ...updates }; // Merge the updates with the existing state
        this.onChange(this.state); // Notify listeners about the updated state
    }

    // Method to get a specific state value or the entire state
    getState(key?: string): any {
        if (key) {
            return this.state[key]; // Retrieve the specific key's value
        }
        return this.state; // Return the entire state if no key is specified
    }
}
