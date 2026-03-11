const express = require("express");
const {addSubscriber,removeSubscriber,createSubscriber,consumeEvent} = require("../controllers/subscriberController");

const router = express.Router();
router.post("/", createSubscriber);
router.post("/subscribe", addSubscriber);
router.post("/unsubscribe", removeSubscriber);
router.get("/:id/consume", consumeEvent);

module.exports = router;
