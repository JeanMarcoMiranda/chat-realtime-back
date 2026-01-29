import { Test, TestingModule } from "@nestjs/testing";
import { ChatService } from "./chat.service";

describe('ChatService', () => {
    let service: ChatService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ChatService],
        }).compile()

        service = module.get<ChatService>(ChatService)
    })

    it('should add a user correctly', () => {
        const user = service.addUser('socket-123', 'Tester');
        expect(user).toBeDefined();
        expect(user.nickname).toBe('Tester');
        expect(service.getConnectedUsers()).toHaveLength(1);
    });

    it('should remove a user', () => {
        service.addUser('socket-123', 'Tester');
        const removed = service.removeUser('socket-123');
        expect(removed?.nickname).toBe('Tester');
        expect(service.getConnectedUsers()).toHaveLength(0);
    });

    it('should limit messages history to 50', () => {
        for (let i = 0; i < 60; i++) {
            service.addMessage('u1', 'Nick', `Msg ${i}`);
        }
        const history = service.getMessages();
        expect(history).toHaveLength(50);
        expect(history[0].content).toBe('Msg 10');
    });
})