const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter();

// Create an instance of the mediator
const mediator = new Mediator();

// Subscribe mediator to the EventEmitter
eventEmitter.on('event', (data) => {
  mediator.notify(data);
});

// Create instances of subscribers
const subscriberOne = new SubscriberOne();
const subscriberTwo = new SubscriberTwo();

// Register subscribers with the mediator
mediator.addSubscriber(subscriberOne);
mediator.addSubscriber(subscriberTwo);

// When an event is emitted, all subscribers will be notified through the mediator
eventEmitter.emit('event', 'This is a test event');
