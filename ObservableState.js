class ObservableState<T extends Record<string, any>> {
    private state: T;
    private onChange: (newState: T) => void;

    constructor(initialState: T, onChange: (newState: T) => void) {
        this.state = initialState;
        this.onChange = onChange;
    }

    updateState(newState: Partial<T>) {
        this.state = { ...this.state, ...newState };
        this.onChange(this.state);
    }

    getState(): T {
        return this.state;
    }
}
