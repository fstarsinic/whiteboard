interface DistributionStrategy {
    assignWork(workItems: string[], processId: number, totalProcesses: number): string[];
}



class RegexStrategy implements DistributionStrategy {
    private regex: RegExp;

    constructor(regex: RegExp) {
        this.regex = regex;
    }

    assignWork(workItems: string[], processId: number, totalProcesses: number): string[] {
        return workItems.filter(item => this.regex.test(item));
    }
}



class RoundRobinStrategy implements DistributionStrategy {
    assignWork(workItems: string[], processId: number, totalProcesses: number): string[] {
        return workItems.filter((_, index) => index % totalProcesses === processId);
    }
}



class StrategyFactory {
    static createStrategy(type: string, options?: any): DistributionStrategy {
        switch (type) {
            case 'regex':
                return new RegexStrategy(new RegExp(options.pattern));
            case 'round-robin':
                return new RoundRobinStrategy();
            default:
                throw new Error(`Unknown strategy type: ${type}`);
        }
    }
}


{
    "strategies": {
        "process1": { "type": "regex", "options": { "pattern": "^task1" } },
        "process2": { "type": "round-robin" }
    }
}


import * as fs from 'fs';

class WorkDistributor {
    private strategies: Map<string, DistributionStrategy>;

    constructor(configPath: string) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        this.strategies = new Map();

        for (const [processId, strategyConfig] of Object.entries(config.strategies)) {
            this.strategies.set(processId, StrategyFactory.createStrategy(strategyConfig.type, strategyConfig.options));
        }
    }

    distributeWork(processId: string, workItems: string[]): string[] {
        const strategy = this.strategies.get(processId);
        if (!strategy) {
            throw new Error(`No strategy found for process ${processId}`);
        }

        const totalProcesses = this.strategies.size;
        return strategy.assignWork(workItems, parseInt(processId.replace('process', '')), totalProcesses);
    }
}

// Usage
const distributor = new WorkDistributor('path/to/config.json');
const workItems = ['task1', 'task2', 'task3', 'task4'];

const process1Work = distributor.distributeWork('process1', workItems);
const process2Work = distributor.distributeWork('process2', workItems);

console.log('Process 1 work:', process1Work);
console.log('Process 2 work:', process2Work);

