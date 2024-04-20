import { EventEmitter } from 'events';

class EventMediator extends EventEmitter {
    private moduleStates: Map<string, any>;

    constructor() {
        super();
        this.moduleStates = new Map();
    }

    notifyStateChange(moduleId: string, state: any) {
        // Update the state for the specific module
        this.moduleStates.set(moduleId, state);
        this.emit('stateChange', { moduleId, state });
    }

    getState(moduleId: string) {
        return this.moduleStates.get(moduleId);
    }
}
