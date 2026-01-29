import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { JoinChatDto } from "./dto/join-chat.dto";
import { SendMessageDto } from "./dto/send-message.dto";

@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`)
    }

    handleDisconnect(client: any) {
        const user = this.chatService.removeUser(client.id)

        if (user) {
            this.server.emit('user_disconected', user);
            this.server.emit('users_updated', this.chatService.getConnectedUsers())
        }
    }

    @SubscribeMessage('join')
    handleJoin(
        @MessageBody() joinChatDto: JoinChatDto,
        @ConnectedSocket() client: Socket
    ) {
        const user = this.chatService.addUser(client.id, joinChatDto.nickname);

        client.emit('message_history', this.chatService.getMessages());

        this.server.emit('users_updated', this.chatService.getConnectedUsers())

        client.broadcast.emit('user_joined', user)

        return user
    }

    @SubscribeMessage('send_message')
    handleMessage(
        @MessageBody() SendMessageDto: SendMessageDto,
        @ConnectedSocket() client: Socket
    ) {
        const user = this.chatService.getUserBySocketId(client.id);

        if (!user) {
            return { error: 'User not found' }
        }

        const message = this.chatService.addMessage(
            user.id,
            user.nickname,
            SendMessageDto.content
        )

        this.server.emit('new_message', message)
        return message
    }
}