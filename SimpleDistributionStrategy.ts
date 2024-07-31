interface ProcessConfig {
    type: string;
    options?: any;
}


class RegexStrategy {
    private regex: RegExp;

    constructor(options: any) {
        this.regex = new RegExp(options.pattern);
    }

    shouldProcess(workItem: string): boolean {
        return this.regex.test(workItem);
    }
}

class RoundRobinStrategy {
    private processId: number;
    private totalProcesses: number;

    constructor(options: any) {
        this.processId = options.processId;
        this.totalProcesses = options.totalProcesses;
    }

    shouldProcess(workItem: string, index: number): boolean {
        return index % this.totalProcesses === this.processId;
    }
}



import * as fs from 'fs';

function loadConfig(processId: string): ProcessConfig {
    const config = JSON.parse(fs.readFileSync('path/to/config.json', 'utf-8'));
    return config.strategies[processId];
}

function createStrategy(config: ProcessConfig): any {
    switch (config.type) {
        case 'regex':
            return new RegexStrategy(config.options);
        case 'round-robin':
            return new RoundRobinStrategy(config.options);
        default:
            throw new Error(`Unknown strategy type: ${config.type}`);
    }
}


function processWork(processId: string, workItems: string[]): string[] {
    const config = loadConfig(processId);
    const strategy = createStrategy(config);

    return workItems.filter((item, index) => {
        if (config.type === 'regex') {
            return strategy.shouldProcess(item);
        } else if (config.type === 'round-robin') {
            return strategy.shouldProcess(item, index);
        }
    });
}

// Example usage
const processId = 'process1';
const workItems = ['task1', 'task2', 'task3', 'task4'];

const workToProcess = processWork(processId, workItems);
console.log(`Process ${processId} work:`, workToProcess);



{
    "strategies": {
        "process1": { "type": "regex", "options": { "pattern": "^task1" } },
        "process2": { "type": "round-robin", "options": { "processId": 1, "totalProcesses": 2 } }
    }
}



