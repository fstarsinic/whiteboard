import { EventMediator } from './EventMediator';
import { ObservableState } from './ObservableState';

export abstract class Processor {
    protected state: ObservableState<any>;
    protected moduleId: string;
    protected mediator: EventMediator;

    constructor(moduleId: string, initialState: any, mediator: EventMediator) {
        this.moduleId = moduleId;
        this.mediator = mediator;
        this.state = new ObservableState(initialState, (newState) => {
            this.mediator.notifyStateChange(this.moduleId, newState);
        });
    }

    abstract execute(): void;
}

export class SuccessFailureProcessor extends Processor {
    execute() {
        for (let i = 0; i < 100; i++) {
            const currentState = this.state.getState();
            const updatedState = {
                ...currentState,
                success_count: currentState.success_count + (Math.random() > 0.5 ? 1 : 0),
                failure_count: currentState.failure_count + (Math.random() <= 0.5 ? 1 : 0),
            };
            this.state.updateState(updatedState);
        }
    }
}
