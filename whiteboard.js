class Mediator {
  constructor() {
    this.subscribers = [];
  }

  // Method to add subscribers to the mediator
  addSubscriber(subscriber) {
    this.subscribers.push(subscriber);
  }

  // Notify all subscribers about an event
  notify(eventData) {
    this.subscribers.forEach(subscriber => {
      subscriber.update(eventData);
    });
  }
}




class SubscriberOne {
  update(eventData) {
    console.log(`Subscriber One received event data: ${eventData}`);
    // Handle the event data
  }
}

class SubscriberTwo {
  update(eventData) {
    console.log(`Subscriber Two received event data: ${eventData}`);
    // Handle the event data
  }
}

// Add more subscribers as needed
