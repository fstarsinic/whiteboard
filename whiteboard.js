import json
import time

# Shared State Definition
class SharedState:
    def __init__(self):
        self.counter = 0
        self.previous_states = []
        self.lastSleepDuration = 0

    def save_state(self):
        self.previous_states.append({"counter": self.counter, "lastSleepDuration": self.lastSleepDuration})

    def rollback(self):
        if self.previous_states:
            last_state = self.previous_states.pop()
            self.counter = last_state["counter"]
            self.lastSleepDuration = last_state["lastSleepDuration"]
        else:
            print("No previous state to rollback to.")

# Module Definition
class Module:
    def __init__(self, name, action, **params):
        self.name = name
        self.action = action
        self.params = params

    def run(self, state):
        return self.action(state, **self.params)

# Action Functions
def sleep_action(state, duration=1):
    print(f"Sleeping for {duration} second(s).")
    time.sleep(duration)
    state.lastSleepDuration = duration
    return "completed"

def print_action(state, message=""):
    print(message)
    return "completed"

# Workcase Definition
class Workcase:
    def __init__(self, name, modules, rules_file):
        self.name = name
        self.modules = modules
        with open(rules_file, "r") as file:
            self.rules = json.load(file)
        self.state = SharedState()

    def execute(self):
        for module in self.modules:
            result = module.run(self.state)
            self.evaluate_rules(result)
            print(f"Module {module.name} executed with result: {result}")

    def evaluate_rules(self, result):
        for rule in self.rules:
            if eval(rule["condition"], {}, {"state": self.state.__dict__}):
                print(f"Rule {rule['id']} triggered: {rule['action']}")
                # Here, implement logic to handle the rule's action

# Orchestrator Definition
class SystemOrchestrator:
    def __init__(self, workcases):
        self.workcases = workcases

    def execute(self):
        for name, workcase in self.workcases.items():
            print(f"Executing workcase: {name}")
            workcase.execute()
            print(f"Workcase {name} completed\n")

# Example Usage
if __name__ == "__main__":
    # Define modules with parameters
    sleep_module_short = Module("ShortSleep", sleep_action, duration=1)
    sleep_module_long = Module("LongSleep", sleep_action, duration=5)
    print_module = Module("Print", print_action, message="All done")

    # Initialize workcases with modules and a path to the rules file
    workcase1 = Workcase("Short Sleep Workcase", [sleep_module_short, print_module], "rules.json")
    workcase2 = Workcase("Long Sleep Workcase", [sleep_module_long, print_module], "rules.json")

    # Define the orchestrator with workcases
    orchestrator = SystemOrchestrator({
        "Workcase 1": workcase1,
        "Workcase 2": workcase2
    })

    # Execute the orchestrator to run the workcases
    orchestrator.execute()




[
  {
    "id": "repeatSleep",
    "condition": "sleepCounter < 10 && sleepCounter != 5",
    "action": "repeat"
  },
  {
    "id": "midwayCheckpoint",
    "condition": "sleepCounter == 5",
    "action": "transferAndReturn",
    "targetModule": "midway"
  },
  {
    "id": "proceedToFinal",
    "condition": "sleepCounter >= 10",
    "action": "next",
    "nextModule": "finalStep"
  },
  {
    "id": "handleSleepError",
    "condition": "lastError == 'sleep'",
    "action": "transfer",
    "targetModule": "errorHandler"
  },
  {
    "id": "handleOtherError",
    "condition": "lastError != 'sleep' && lastError != ''",
    "action": "continue"
  }
]

