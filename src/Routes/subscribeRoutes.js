const express = require("express");
const {
  addSubscriber,
  removeSubscriber,
  createSubsciber,
  consumeEvent,
} = require("../controllers/subscriberController");

const router = express.Router();
router.post("/", createSubsciber);
router.post("/subscribe", addSubscriber);
router.post("/unsubscribe", removeSubscriber);
router.get("/:id/consume", consumeEvent);

module.exports = router;
