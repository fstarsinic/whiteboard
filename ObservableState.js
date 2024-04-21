class ObservableState {
    private state: Record<string, any>;
    private onChange: (newState: Record<string, any>, moduleName: string) => void;

    constructor(initialState: Record<string, any>, onChange: (newState: Record<string, any>, moduleName: string) => void) {
        this.state = initialState;
        this.onChange = onChange;
    }

    updateState(updates: Record<string, any>, moduleName: string) {
        // Merge existing state with the updates
        this.state = { ...this.state, ...updates };

        // Notify change with module context
        this.onChange(this.state, moduleName);
    }

    getState(): Record<string, any> {
        return this.state;
    }
}
