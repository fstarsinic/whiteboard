class ObservableState {
    private state: Record<string, any>;
    private onChange: (newState: Record<string, any>) => void;

    constructor(initialState: Record<string, any>, onChange: (newState: Record<string, any>) => void) {
        this.state = initialState;
        this.onChange = onChange;
    }

    // Method to update state with a key-value pair
    updateState(key: string, value: any) {
        this.state[key] = value; // Direct assignment to the state
        this.onChange(this.state); // Notify change
    }

    // Method to get a specific state value
    getState(key?: string): any {
        if (key) {
            return this.state[key]; // Retrieve a specific key's value
        }
        return this.state; // Return the entire state if no key is provided
    }
}
