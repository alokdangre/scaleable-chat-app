# Turborepo starter

This is an official starter Turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

Below is a sample `README.md` file for a WebSocket-based chat application that addresses the scaling issue using Redis and Kafka. This file explains the architecture, setup instructions, and how the system works.

---

## **Scalable Chat Application**

### **Overview**
This is a real-time WebSocket-based chat application designed to scale across multiple servers. It uses Redis for real-time message delivery between users connected to different WebSocket servers and Kafka for reliable message persistence. This architecture ensures that messages are delivered instantly across servers and safely stored in the database without overwhelming it.

### **Problem**
In a distributed system where users are connected to different servers, messages sent through WebSockets are not delivered unless both users are connected to the same server. Directly pushing messages to a PostgreSQL database for persistence can overload and crash the database, especially with high traffic.

### **Solution**
To solve this problem:
- **Redis** is used to facilitate real-time communication between servers. Messages are published to a Redis channel, and all WebSocket servers are subscribed to this channel. This allows messages to be delivered instantly across servers.
- **Kafka** is used to handle reliable message processing and to persist messages in PostgreSQL without overwhelming the database. Messages are stored in Kafka and then processed asynchronously to be stored in the database.

### **Architecture**

1. **WebSocket Servers**: Handle real-time communication with clients.
2. **Redis**: Acts as a Pub/Sub broker for delivering messages between WebSocket servers.
3. **Kafka**: Queues and processes messages for eventual persistence in the database.
4. **PostgreSQL**: Stores the chat messages persistently.

### **Flow**
1. **Message Sending**: 
   - User A sends a message to User B.
   - The message is sent to the WebSocket server User A is connected to.
2. **Real-Time Delivery**:
   - The WebSocket server publishes the message to a Redis channel.
   - All other WebSocket servers (including the one User B is connected to) receive the message and deliver it to the appropriate user.
3. **Asynchronous Persistence**:
   - The WebSocket server also pushes the message to Kafka.
   - Kafka queues the message and slowly pushes it to PostgreSQL to avoid overloading the database.
4. **Message Retrieval**:
   - When User B connects, any missed messages can be fetched from Redis if still cached, or from PostgreSQL for historical messages.

### **Technologies Used**
- **Node.js**: The server environment.
- **WebSockets**: For real-time communication between clients and servers.
- **Redis**: As a Pub/Sub mechanism to broadcast messages across servers.
- **Kafka**: For reliable message queuing and eventual consistency with the database.
- **PostgreSQL**: For persistent storage of chat messages.

### **Installation**

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/scalable-chat-app.git
   cd scalable-chat-app
   ```

2. **Install Dependencies**:
   Use Yarn or NPM to install the required packages.
   ```bash
   yarn install
   ```

3. **Setup Redis**:
   Ensure Redis is running locally or on a remote server.
   - For local Redis, start it with:
   ```bash
   redis-server
   ```

4. **Setup Kafka**:
   Install Kafka locally or connect to a Kafka cluster.
   - For local Kafka:
   ```bash
   ./bin/zookeeper-server-start.sh config/zookeeper.properties
   ./bin/kafka-server-start.sh config/server.properties
   ```

5. **Set Up Environment Variables**:
   This is just an example
   Create a `.env` file and configure your Redis, Kafka, and database settings:
   ```bash
   REDIS_HOST=localhost
   REDIS_PORT=6379
   KAFKA_BROKER=localhost:9092
   POSTGRES_URL=postgres://username:password@localhost:5432/chatdb
   ```

6. **Run the Application**:
   Start the WebSocket servers:
   ```bash
   yarn dev
   ```

### **Usage**

Once the application is running:
1. Open two or more browser windows and connect different users to the chat.
2. Send messages between users. The messages will be delivered in real-time, even if the users are connected to different servers.
3. Messages will be persisted in PostgreSQL via Kafka for future retrieval.

### **Scaling the Application**

To scale the application:
- **Horizontal Scaling**: Deploy multiple instances of the WebSocket server across different machines or containers.
- **Redis Pub/Sub**: Ensure all instances are connected to the same Redis instance to synchronize messages between users across servers.
- **Kafka**: Ensure Kafka brokers are set up in a way that can handle high traffic and provide reliable message persistence.

### **Contributing**
If you’d like to contribute to this project, please submit a pull request or raise an issue on GitHub. Contributions for new features, bug fixes, and optimizations are welcome!

### **License**
This project is licensed under the MIT License.

---

This `README.md` should provide a clear understanding of the architecture, installation, and usage of your scalable WebSocket chat application. It also includes instructions for contributing and licensing.