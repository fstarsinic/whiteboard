import { EventMediator } from './EventMediator';
import { EventMonitor } from './EventMonitor';
import { SuccessFailureProcessor } from './Processor';

class Main {
    private mediator: EventMediator;
    private moduleId: string;

    constructor(moduleId: string) {
        this.moduleId = moduleId;
        this.mediator = new EventMediator();
        new EventMonitor(this.mediator);
    }

    run() {
        const processor = new SuccessFailureProcessor(this.moduleId, { name: "Processor1", success_count: 0, failure_count: 0 }, this.mediator);
        processor.execute();
    }
}

const main1 = new Main("Module1");
main1.run();

const main2 = new Main("Module2");
main2.run();
