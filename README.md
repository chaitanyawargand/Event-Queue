# In-Memory Event Queue

A lightweight, purely in-memory publisher-subscriber (Pub/Sub) event distribution system built with Node.js and Express.

This project implements a custom event queue architecture allowing producers to publish events to specific topics, and multiple independent consumers to subscribe and retrieve those events in strict First-In-First-Out (FIFO) order.

## Architectural Overview

The system mimics the foundational concepts of distributed message brokers (like Kafka or RabbitMQ) while running entirely in local memory without external database dependencies.

- **Topics**: Logical channels where producers publish events.
- **Subscribers**: Independent consumers that subscribe to one or more topics.
- **Strict Isolation**: Every subscriber maintains its own isolated event queue. If two subscribers are listening to the same topic, they consume messages at their own pace without interfering with each other.
- **Late Subscription**: Subscribers only receive events published *after* the exact moment they subscribe to a topic.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

## Quick Start
### 1. Installation
Clone the repository and install the minimal dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

### 2. Running the Server

Start the REST API server on the default port (3000):

```bash
npm start
```
*(Alternatively, run `node server.js`)*

### 3. Running the E2E Test

The project includes an End-to-End (E2E) testing script that programmatically acts as multiple clients interacting with the API to prove the Pub/Sub logic (isolation, FIFO, and subscriptions).

Open a new terminal window while the server is running and execute:

```bash
node test_e2e.js
```

## API Reference

The system is fully controllable via RESTful APIs.

### Topics
| Method | Endpoint | Description | Body / Params |
|--------|----------|-------------|---------------|
| `POST` | `/topics` | Create a new topic | `{ "name": "string" }` |
| `GET`  | `/topics` | Get all topics | - |
| `GET`  | `/topics/:id` | Get single topic details | `id` in URL |

### Subscribers
| Method | Endpoint | Description | Body / Params |
|--------|----------|-------------|---------------|
| `POST` | `/subscribers` | Create a new subscriber | `{ "name": "string" }` |
| `POST` | `/subscribers/subscribe` | Subscribe to a topic | `{ "topicid": "uuid", "subscriberid": "uuid" }` |
| `POST` | `/subscribers/unsubscribe` | Unsubscribe from a topic | `{ "topicid": "uuid", "subscriberid": "uuid" }` |
| `GET`  | `/subscribers/:id/consume` | Consume next event (FIFO) | `id` in URL |

### Events (Publishers)
| Method | Endpoint | Description | Body / Params |
|--------|----------|-------------|---------------|
| `POST` | `/events/publish` | Publish event to topic | `{ "topicid": "uuid", "message": "any" }` |

## Project Structure

```
├── server.js               # Entry point, starts the HTTP server
├── test.js                 # End-to-end integration test script
└── src/
    ├── app.js              # Express app configuration & middleware
    ├── Memory.js           # In-memory data store using ES6 Maps
    ├── Routes/             # Express routing files
    ├── controllers/        # Request handling and business logic
    └── models/             # ES6 Class definitions (Event, Subscriber, Topic)
```

## Error Handling & Edge Cases
The API includes robust validation to handle edge cases gracefully, returning appropriate HTTP status codes:
- **404 Not Found**: Attempting to interact with non-existent UUIDs.
- **409 Conflict**: Attempting to create duplicate Topic/Subscriber names, or duplicate subscriptions.
- **400 Bad Request**: Missing required payload parameters.
