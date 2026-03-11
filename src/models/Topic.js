class Topic {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.subscribers = new Set();
    this.events = [];
  }
  addSubscriber(subscriberId) {
    this.subscribers.add(subscriberId);
  }
  removeSubscriber(subscriberId) {
    this.subscribers.delete(subscriberId);
  }
  getSubscribers() {
    return [...this.subscribers];
  }
  addEvent(event) {
    this.events.push(event);
  }
}
module.exports = Topic;
