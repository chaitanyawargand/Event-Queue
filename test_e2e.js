const app = require("./src/app");
const http = require("http");
const PORT = 3000;
const server = http.createServer(app);

server.listen(PORT, async () => {
  let topicId;
  let sub1Id;
  let sub2Id;
  try {
    const req = await fetch(`http://localhost:${PORT}/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Notifications" }),
    }).then((r) => r.json());
    topicId = req.topic.id;
    console.log("Topic created:", topicId);
    const sub1 = await fetch(`http://localhost:${PORT}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "UserA" }),
    }).then((r) => r.json());
    sub1Id = sub1.subscriber.id;
    const sub2 = await fetch(`http://localhost:${PORT}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "UserB" }),
    }).then((r) => r.json());
    sub2Id = sub2.subscriber.id;
    await fetch(`http://localhost:${PORT}/subscribers/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub1Id }),
    });
    await fetch(`http://localhost:${PORT}/events/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, message: "Hello World" }),
    });
    await fetch(`http://localhost:${PORT}/subscribers/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub2Id }),
    });
    await fetch(`http://localhost:${PORT}/events/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, message: "Second Event" }),
    });
    const e1 = await fetch(
      `http://localhost:${PORT}/subscribers/${sub1Id}/consume`
    ).then((r) => r.json());

    const e2 = await fetch(
      `http://localhost:${PORT}/subscribers/${sub1Id}/consume`
    ).then((r) => r.json());

    const e3 = await fetch(
      `http://localhost:${PORT}/subscribers/${sub2Id}/consume`
    ).then((r) => r.json());

    console.log("UserA received:", e1.event?.message);
    console.log("UserA received:", e2.event?.message);
    console.log("UserB received:", e3.event?.message);

    await fetch(`http://localhost:${PORT}/subscribers/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub1Id }),
    });

    console.log("Test finished");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    server.close();
  }
});