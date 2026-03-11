const app = require("./src/app");
const http = require("http");
const PORT = 3000;

const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log("Starting Event Queue Test...\n");

  let topicId, sub1Id, sub2Id;

  try {
    // Create topic
    const topicRes = await fetch(`http://localhost:${PORT}/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Notifications" }),
    }).then((r) => r.json());
    topicId = topicRes.topic.id;

    // Create subscribers
    const s1 = await fetch(`http://localhost:${PORT}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "UserA" }),
    }).then((r) => r.json());
    sub1Id = s1.subscriber.id;

    const s2 = await fetch(`http://localhost:${PORT}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "UserB" }),
    }).then((r) => r.json());
    sub2Id = s2.subscriber.id;

    // Subscribe UserA
    await fetch(`http://localhost:${PORT}/subscribers/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub1Id }),
    });

    // Publish first event
    await fetch(`http://localhost:${PORT}/events/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, message: "Hello World" }),
    });

    // Subscribe UserB (late subscriber)
    await fetch(`http://localhost:${PORT}/subscribers/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub2Id }),
    });

    // Publish second event
    await fetch(`http://localhost:${PORT}/events/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, message: "Second Event" }),
    });

    // Consume events
    const e1 = await fetch(
      `http://localhost:${PORT}/subscribers/${sub1Id}/consume`
    ).then((r) => r.json());
    const e2 = await fetch(
      `http://localhost:${PORT}/subscribers/${sub1Id}/consume`
    ).then((r) => r.json());
    const e3 = await fetch(
      `http://localhost:${PORT}/subscribers/${sub2Id}/consume`
    ).then((r) => r.json());

    console.log("UserA got:", e1.event?.message);
    console.log("UserA got:", e2.event?.message);
    console.log("UserB got:", e3.event?.message);

    // Unsubscribe UserA
    await fetch(`http://localhost:${PORT}/subscribers/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub1Id }),
    });

    console.log("\nTest finished.");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    server.close();
  }
});