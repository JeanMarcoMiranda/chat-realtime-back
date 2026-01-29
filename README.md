<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <h1 align="center">Chat Realtime Backend</h1>
</p>

This is the backend server for the Real-time Chat application, built with **NestJS** and **Socket.io**. It handles real-time bidirectional communication between the server and connected clients, managing user sessions and message history in memory.

## Technologies & Libraries

The project relies on a robust stack to ensure performance and scalability:

- **[NestJS](https://nestjs.com/)**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **[Socket.io](https://socket.io/)**: Enables real-time, bidirectional and event-based communication.
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language that builds on JavaScript.
- **[UUID](https://github.com/uuidjs/uuid)**: For generating unique identifiers for users and messages.
- **[Class Validator](https://github.com/typestack/class-validator) & [Class Transformer](https://github.com/typestack/class-transformer)**: For validating incoming data transfer objects (DTOs).

## Project Structure

 The codebase is organized into modules, following NestJS best practices:

```
src/
├── chat/
│   ├── dto/                # Data Transfer Objects (Validation)
│   ├── entities/           # TypeScript Interfaces for User & Message
│   ├── chat.gateway.ts     # WebSocket Gateway (Event Handling)
│   ├── chat.module.ts      # Module Definition
│   └── chat.service.ts     # Business Logic & In-Memory Storage
├── app.module.ts           # Root Module
└── main.ts                 # Entry Point (CORS & Validation Setup)
```

## Application Flow & Logic

### 1. Connection Handling
- The server listens for WebSocket connections on the configured port.
- **CORS** is enabled to allow connections from the frontend (default `http://localhost:5173`).
- When a client disconnects, they are automatically removed from the active users list, and all other clients are notified.

### 2. In-Memory Storage
> [!NOTE]
> Currently, data is stored in memory (`ChatService`), meaning all data (users and messages) is reset when the server restarts.
- **Users**: Stored in a `Map` linking `socket.id` to user details.
- **Messages**: Stored in an array (capped at the last 50 messages).

### 3. WebSocket Events API

#### Client -> Server (Emitted by Frontend)

| Event | Data (DTO) | Description |
| :--- | :--- | :--- |
| `join` | `{ nickname: string }` | Registers a user with a nickname. Returns their User object. |
| `send_message` | `{ content: string }` | Sends a message to the chat room. |

#### Server -> Client (Emitted by Backend)

| Event | Data | Trigger |
| :--- | :--- | :--- |
| `message_history` | `Message[]` | Sent to the user immediately after joining. |
| `users_updated` | `User[]` | Broadcasted when someone joins or leaves. |
| `user_joined` | `User` | Broadcasted to others when a new user joins. |
| `new_message` | `Message` | Broadcasted when a message is successfully sent. |
| `user_disconected`| `User` | Broadcasted when a user disconnects. |

## Getting Started

Follow these steps to run the backend locally.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if you haven't already)
2. **Navigate to the backend directory**
   ```bash
   cd backend
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

POW (Plain Old Window) or Terminal:

```bash
# development mode (restarts on file changes)
npm run start:dev

# production mode
npm run start:prod
```

The server will start (default port: `3000`).

### Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## License

This project is [MIT licensed](LICENSE) (NestJS default).
