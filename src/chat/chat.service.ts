import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { v4 as uuid } from 'uuid';
import { Message } from "./entities/message.entity";

@Injectable()
export class ChatService {
    private readonly users: Map<string, User> = new Map()
    private messages: Message[] = []
    private readonly MAX_MESSAGES = 50;

    addUser(socketId: string, nickname: string): User {
        const user: User = {
            id: uuid(),
            nickname,
            socketId,
            connectedAt: new Date()
        }

        this.users.set(socketId, user)

        return user;
    }

    removeUser(socketId: string): User | null {
        const user = this.users.get(socketId)

        if (user) {
            this.users.delete(socketId)
            return user;
        }

        return null;
    }

    getConnectedUsers(): User[] {
        return Array.from(this.users.values());
    }

    getUserBySocketId(socketId: string): User | null {
        return this.users.get(socketId) || null;
    }

    addMessage(userId: string, nickname: string, content: string): Message {
        const message: Message = {
            id: uuid(),
            userId,
            nickname,
            content,
            timestamp: new Date()
        }

        this.messages.push(message);

        if (this.messages.length > this.MAX_MESSAGES) {
            this.messages = this.messages.slice(-this.MAX_MESSAGES)
        }

        return message;
    }

    getMessages(): Message[] {
        return this.messages;
    }

}