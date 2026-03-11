const express = require("express");
const { publishEvent } = require("../controllers/eventController");

const router = express.Router();

router.post("/publish", publishEvent);

module.exports = router;
