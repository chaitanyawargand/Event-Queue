const express = require("express");
const {
  createTopic,
  getAllTopics,
  getTopic,
} = require("../controllers/topicController");
const router = express.Router();

router.route("/").post(createTopic).get(getAllTopics);

router.get("/:id", getTopic);

module.exports = router;
