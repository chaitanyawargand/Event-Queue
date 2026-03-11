const Topic = require("../models/Topic");
const Memory = require("../Memory");
const { v4: uuidv4 } = require("uuid");

const createTopic = (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Topic name is required",
      });
    }
    const id = uuidv4();
    const topic = new Topic(id, name);
    Memory.topics.set(id, topic);
    return res.status(201).json({
      message: "Topic created successfully",
      topic,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getAllTopics = (req, res) => {
  try {
    const topics = Array.from(Memory.topics.values());

    return res.status(200).json({
      count: topics.length,
      topics,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getTopic = (req, res) => {
  try {
    const { id } = req.params;
    const topic = Memory.topics.get(id);
    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }
    return res.status(200).json({ topic });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createTopic, getAllTopics, getTopic };
