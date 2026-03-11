class Subscriber {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.queue = [];
  }
  enqueue(event) {
    this.queue.push(event);
  }
  dequeue() {
    return this.queue.shift();
  }
  getQueue() {
    return [...this.queue];
  }
}
module.exports = Subscriber;
