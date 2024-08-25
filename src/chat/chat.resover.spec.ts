import { Test, TestingModule } from '@nestjs/testing';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { PubSub } from 'graphql-subscriptions';
import { MessageDTO, MessageInputDTO } from './DTO/message.dto';

jest.mock('./chat.service');
jest.mock('graphql-subscriptions', () => {
    const mPubSub = {
        publish: jest.fn(),
        asyncIterator: jest.fn(),
    };
    return { PubSub: jest.fn(() => mPubSub) };
});

describe('ChatResolver', () => {
    let resolver: ChatResolver;
    let chatService: ChatService;
    let pubSub: PubSub;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatResolver,
                ChatService,
                PubSub,
            ],
        }).compile();

        resolver = module.get<ChatResolver>(ChatResolver);
        chatService = module.get<ChatService>(ChatService);
        pubSub = module.get<PubSub>(PubSub);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should return async iterator for messageReceived subscription', () => {
        const asyncIterator = {};
        (pubSub.asyncIterator as jest.Mock).mockReturnValue(asyncIterator);

        const result = resolver.messageReceived();

        expect(pubSub.asyncIterator).toHaveBeenCalledWith('messageReceived');
        expect(result).toBe(asyncIterator);
    });
});
