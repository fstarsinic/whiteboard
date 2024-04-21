class Processor {
    protected state: ObservableState;
    protected mediator: EventMediator;
    protected moduleName: string;

    constructor(moduleName: string, mediator: EventMediator) {
        this.moduleName = moduleName;
        this.mediator = mediator;
        this.state = new ObservableState({}, (newState, module) => {
            this.mediator.notifyStateChange(module, newState); // Notify with module context
        });
    }

    // Retrieve the processor's name from a property or context
    protected getProcessorName(): string {
        return this.constructor.name; // Using the class name as the processor name
    }

    // Method to update state with custom keys
    updateProcessorState(key: string, value: any) {
        const fullKey = `${this.moduleName}.${this.getProcessorName()}.${key}`; // Dynamic key
        this.state.updateState(fullKey, value, this.moduleName); // Update with the complete key
    }

    abstract execute(): void; // Define a common method to be implemented by subclasses
}
