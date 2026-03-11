const app = require('./src/app');
const http = require('http');

const PORT = 3001;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log('✅ Test server started');
  let topicId = null;
  let sub1Id = null;
  let sub2Id = null;

  try {
    // 1. Create Topic
    const t1 = await fetch(`http://localhost:${PORT}/topics`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Notifications' })
    }).then(r => r.json());
    topicId = t1.topic.id;
    console.log('✅ Created Topic:', t1.topic.name);

    // 2. Create Subscribers
    const s1 = await fetch(`http://localhost:${PORT}/subscribers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'UserA' })
    }).then(r => r.json());
    sub1Id = s1.subscriber.id;
    console.log('✅ Created Subscriber 1:', s1.subscriber.name);

    const s2 = await fetch(`http://localhost:${PORT}/subscribers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'UserB' })
    }).then(r => r.json());
    sub2Id = s2.subscriber.id;
    console.log('✅ Created Subscriber 2:', s2.subscriber.name);

    // 3. Subscribe UserA to Notifications
    await fetch(`http://localhost:${PORT}/subscribers/subscribe`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub1Id })
    });
    console.log('✅ Subscribed UserA to Notifications');

    // 4. Publish Event
    await fetch(`http://localhost:${PORT}/events/publish`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicid: topicId, message: 'Hello World!' })
    });
    console.log('✅ Published Event to Notifications');

    // 5. Subscribe UserB (late subscriber - shouldn't get previous event)
    await fetch(`http://localhost:${PORT}/subscribers/subscribe`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub2Id })
    });
    
    // Publish another event
    await fetch(`http://localhost:${PORT}/events/publish`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicid: topicId, message: 'Second Event!' })
    });

    // 6. Consume events
    const e1 = await fetch(`http://localhost:${PORT}/subscribers/${sub1Id}/consume`).then(r => r.json());
    console.log('✅ UserA consumed:', e1.event.message);

    const e2 = await fetch(`http://localhost:${PORT}/subscribers/${sub1Id}/consume`).then(r => r.json());
    console.log('✅ UserA consumed:', e2.event.message);

    const e3 = await fetch(`http://localhost:${PORT}/subscribers/${sub2Id}/consume`).then(r => r.json());
    console.log('✅ UserB consumed:', e3.event.message);

    // Unsubscribe UserA
    await fetch(`http://localhost:${PORT}/subscribers/unsubscribe`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicid: topicId, subscriberid: sub1Id })
    });
    console.log('✅ Unsubscribed UserA from Notifications');

    console.log('🎉 ALL TESTS PASSED!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
