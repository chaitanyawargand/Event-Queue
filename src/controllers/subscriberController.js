const Subscriber = require("../models/Subscriber");
const Memory = require("../Memory");
const { v4: uuidv4 } = require("uuid");

const createSubscriber = (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Subscriber name is required",
      });
    }
    const subExists = Array.from(Memory.subscribers.values()).some((s) => s.name === name);
    if (subExists) {
      return res.status(409).json({ message: "Subscriber name already exists" });
    }
    const id = uuidv4();
    const subscriber = new Subscriber(id, name);
    Memory.subscribers.set(id, subscriber);
    return res.status(201).json({
      message: "Subscriber created successfully",
      subscriber,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const addSubscriber = (req, res) => {
  try {
    const { topicid, subscriberid } = req.body;
    if (!topicid || !subscriberid)
      return res.status(400).json({ message: "Bad request" });
    const topic = Memory.topics.get(topicid);
    if (!topic) return res.status(404).json({ message: "Topic Not found" });
    const subscriber = Memory.subscribers.get(subscriberid);
    if (!subscriber)
      return res.status(404).json({ message: "Subscriber not found" });
    if (topic.hasSubscriber(subscriberid)) {
      return res.status(409).json({ message: "Subscriber is already subscribed to this topic" });
    }
    topic.addSubscriber(subscriberid);
    return res.status(200).json({ message: "Subscriber added" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const removeSubscriber = (req, res) => {
  try {
    const { topicid, subscriberid } = req.body;
    if (!topicid || !subscriberid)
      return res.status(400).json({ message: "Bad request" });
    const topic = Memory.topics.get(topicid);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const subscriber = Memory.subscribers.get(subscriberid);
    if (!subscriber)
      return res.status(404).json({ message: "Subscriber not found" });
    if (!topic.hasSubscriber(subscriberid)) {
      return res.status(404).json({ message: "Subscriber is not subscribed to this topic" });
    }
    topic.removeSubscriber(subscriberid);
    return res.status(200).json({ message: "Subscriber removed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const consumeEvent = (req, res) => {
  const { id } = req.params;
  const subscriber = Memory.subscribers.get(id);
  if (!subscriber) {
    return res.status(404).json({ message: "Subscriber not found" });
  }
  const event = subscriber.dequeue();
  if (!event) {
    return res.status(200).json({ message: "No events in queue" });
  }
  return res.status(200).json({ event });
};

module.exports = {
  addSubscriber,
  removeSubscriber,
  createSubscriber,
  consumeEvent,
};
