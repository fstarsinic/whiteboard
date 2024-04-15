import { EventEmitter } from 'events';

class EventMediator extends EventEmitter {
    constructor() {
        super();
    }

    notifyStateChange(state: any) {
        this.emit('stateChange', state);
    }
}

class EventMonitor {
    constructor(mediator: EventMediator) {
        mediator.on('stateChange', (state) => this.printState(state));
    }

    printState(state: any) {
        console.log('State Updated:', JSON.stringify(state, null, 2));
    }
}

abstract class Processor {
    protected name: string;
    protected mediator: EventMediator;

    constructor(name: string, mediator: EventMediator) {
        this.name = name;
        this.mediator = mediator;
    }

    abstract execute(): void;

    public getName(): string {
        return this.name;
    }
}

class SuccessFailureProcessor extends Processor {
    execute() {
        let success_count = 0;
        let failure_count = 0;

        for (let i = 0; i < 100; i++) {
            if (Math.random() > 0.5) {
                success_count++;
            } else {
                failure_count++;
            }
            this.mediator.notifyStateChange({
                name: this.name,
                success_count: success_count,
                failure_count: failure_count
            });
        }
    }
}

class RandomEventProcessor extends Processor {
    execute() {
        let success_count = 0;
        let failure_count = 0;

        for (let i = 0; i < 50; i++) { // Different loop count for variety
            if (Math.random() > 0.7) { // Different probability
                success_count++;
            } else {
                failure_count++;
            }
            this.mediator.notifyStateChange({
                name: this.name,
                success_count: success_count,
                failure_count: failure_count
            });
        }
    }
}

class Main {
    private mediator: EventMediator;
    private processors: Processor[];

    constructor() {
        this.mediator = new EventMediator();
        new EventMonitor(this.mediator); // Initialize and link the monitor
        this.processors = [
            new SuccessFailureProcessor("Processor1", this.mediator),
            new RandomEventProcessor("Processor2", this.mediator)
        ];
    }

    executeProcessors() {
        this.processors.forEach(processor => {
            // Send event when the processor starts
            this.mediator.notifyStateChange({
                name: processor.getName(), // Using getter method
                message: 'Starting execution'
            });

            processor.execute();

            // Send event when the processor finishes
            this.mediator.notifyStateChange({
                name: processor.getName(), // Using getter method
                message: 'Finished execution'
            });
        });
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
