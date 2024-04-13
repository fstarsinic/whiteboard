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
        this.processors.forEach(processor => processor.execute());
    }
}

const main = new Main();
main.executeProcessors();



