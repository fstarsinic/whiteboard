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
