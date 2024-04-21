abstract class BaseModule {
    protected moduleName: string;
    protected mediator: EventMediator;

    constructor(moduleName: string, mediator: EventMediator) {
        this.moduleName = moduleName;
        this.mediator = mediator;
    }

    // Method to generate consistent keys
    protected generateKey(key: string): string {
        return `${this.moduleName}.${key}`; // Consistent key structure for the main module
    }

    // Method to update state with a specific key
    protected updateState(key: string, value: any) {
        this.mediator.notifyStateChange(this.moduleName, { [this.generateKey(key)]: value }); // Notify the mediator with updated state
    }

    // Method to get state with a specific key
    protected getStateValue(key: string): any {
        const fullKey = this.generateKey(key); // Generate the key for state retrieval
        return this.mediator.getState(fullKey); // Retrieve the state value from the mediator
    }

    abstract execute(): void; // Abstract method requiring implementation by subclasses
}
