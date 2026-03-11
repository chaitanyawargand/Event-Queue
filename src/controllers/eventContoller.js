const Event = require("../models/Event");
const Memory = require("../Memory");
const { v4: uuidv4 } = require("uuid");

const publishEvent = (req, res) => {
  try {
    const { topicid, message } = req.body;
    if (!topicid || !message)
      return res.status(400).json({ message: "Bad request" });
    const topic = Memory.topics.get(topicid);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const id = uuidv4();
    const event = new Event(id, topicid, message, Date.now());
    topic.addEvent(event);
    const subscribers = topic.getSubscribers();
    subscribers.forEach((subscriberid) => {
      const subscriber = Memory.subscribers.get(subscriberid);
      if (subscriber) {
        subscriber.enqueue(event);
      }
    });
    return res.status(200).json({ message: "Published Event" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { publishEvent };
