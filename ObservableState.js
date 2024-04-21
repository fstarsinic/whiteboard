class ObservableState {
    private state: Record<string, any>; // Using Record to represent a flat key-value store
    private onChange: (newState: Record<string, any>) => void;

    constructor(initialState: Record<string, any>, onChange: (newState: Record<string, any>) => void) {
        this.state = initialState;
        this.onChange = onChange;
    }

    // Update state with a flat key (dot-notation treated as a single key)
    updateState(key: string, value: any) {
        this.state[key] = value; // Directly set or update the key
        this.onChange(this.state); // Notify listeners
    }

    getState(key?: string): any {
        if (key) {
            return this.state[key]; // Retrieve a specific key's value
        }
        return this.state; // Return the entire state if no key is specified
    }
}
