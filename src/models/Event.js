class Event {
  constructor(id, topicid, message, timestamp) {
    this.id = id;
    this.topicid = topicid;
    this.message = message;
    this.timestamp = timestamp;
  }
}
module.exports = Event;
