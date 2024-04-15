import { EventEmitter } from 'events';

export class ObservableState<T> {
    private state: T;
    private onChange: (newState: T) => void;

    constructor(initialState: T, onChange: (newState: T) => void) {
        this.state = initialState;
        this.onChange = onChange;
    }

    updateState(newState: T) {
        this.state = newState;
        this.onChange(newState);
    }

    getState(): T {
        return this.state;
    }
}



import { EventEmitter } from 'events';

export class EventMediator extends EventEmitter {
    notifyStateChange(state: any) {
        this.emit('stateChange', state);
    }
}


import { EventMediator } from './EventMediator';

export class EventMonitor {
    constructor(mediator: EventMediator) {
        mediator.on('stateChange', this.printState);
    }

    printState(state: any) {
        console.log('State Updated:', JSON.stringify(state, null, 2));
    }
}



import { ObservableState } from './ObservableState';

export abstract class Processor {
    protected state: ObservableState<{ name: string; success_count: number; failure_count: number }>;

    constructor(name: string, onChange: (state: { name: string; success_count: number; failure_count: number }) => void) {
        this.state = new ObservableState({ name, success_count: 0, failure_count: 0 }, onChange);
    }

    abstract execute(): void;
}

export class SuccessFailureProcessor extends Processor {
    execute() {
        for (let i = 0; i < 100; i++) {
            if (Math.random() > 0.5) {
                this.state.updateState({ ...this.state.getState(), success_count: this.state.getState().success_count + 1 });
            } else {
                this.state.updateState({ ...this.state.getState(), failure_count: this.state.getState().failure_count + 1 });
            }
        }
    }
}

export class RandomEventProcessor extends Processor {
    execute() {
        for (let i = 0; i < 50; i++) {
            if (Math.random() > 0.7) {
                this.state.updateState({ ...this.state.getState(), success_count: this.state.getState().success_count + 1 });
            } else {
                this.state.updateState({ ...this.state.getState(), failure_count: this.state.getState().failure_count + 1 });
            }
        }
    }
}



import { EventMediator } from './EventMediator';
import { EventMonitor } from './EventMonitor';
import { SuccessFailureProcessor, RandomEventProcessor } from './Processor';

class Main {
    private mediator: EventMediator;
    private processors: Processor[];

    constructor() {
        this.mediator = new EventMediator();
        new EventMonitor(this.mediator); // Initialize and link the monitor
        this.processors = [
            new SuccessFailureProcessor("Processor1", this.mediator.notifyStateChange.bind(this.mediator)),
            new RandomEventProcessor("Processor2", this.mediator.notifyStateChange.bind(this.mediator))
        ];
    }

    executeProcessors() {
        this.processors.forEach(processor => processor.execute());
    }
}

const main = new Main();
main.executeProcessors();



import { ObservableState } from './ObservableState';

export abstract class Processor {
    protected state: ObservableState<{ name: string; success_count: number; failure_count: number }>;

    constructor(name: string, onChange: (state: { name: string; success_count: number; failure_count: number }) => void) {
        this.state = new ObservableState({ name, success_count: 0, failure_count: 0 }, onChange);
    }

    abstract execute(): void;
}

export class SuccessFailureProcessor extends Processor {
    execute() {
        for (let i = 0; i < 100; i++) {
            if (Math.random() > 0.5) {
                this.state.updateState({ ...this.state.getState(), success_count: this.state.getState().success_count + 1 });
            } else {
                this.state.updateState({ ...this.state.getState(), failure_count: this.state.getState().failure_count + 1 });
            }
        }
    }
}

export class RandomEventProcessor extends Processor {
    execute() {
        for (let i = 0; i < 50; i++) {
            if (Math.random() > 0.7) {
                this.state.updateState({ ...this.state.getState(), success_count: this.state.getState().success_count + 1 });
            } else {
                this.state.updateState({ ...this.state.getState(), failure_count: this.state.getState().failure_count + 1 });
            }
        }
    }
}


const main = new Main();
main.executeProcessors();

/*
@startuml
participant Main
participant SuccessFailureProcessor
participant RandomEventProcessor
participant EventMediator
participant EventMonitor

Main -> SuccessFailureProcessor : create()
Main -> RandomEventProcessor : create()
Main -> EventMediator : create()
Main -> EventMonitor : create(mediator)
Main -> EventMediator : connect(monitor.printState)

Main -> SuccessFailureProcessor : execute()
loop Processing Loop
    SuccessFailureProcessor -> EventMediator : notifyStateChange(state)
    EventMediator -> EventMonitor : stateChange
    EventMonitor -> EventMonitor : printState(state)
end

Main -> RandomEventProcessor : execute()
loop Processing Loop
    RandomEventProcessor -> EventMediator : notifyStateChange(state)
    EventMediator -> EventMonitor : stateChange
    EventMonitor -> EventMonitor : printState(state)
end
@enduml
*/
