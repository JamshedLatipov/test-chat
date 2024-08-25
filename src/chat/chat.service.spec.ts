import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { CHAT_TEMPLATE, CHAT_TEMPERATURE, CHAT_MODEL, CHAT_OUTPUT_LANGUAGE } from './chat.const';

jest.mock('@langchain/openai');
jest.mock('@langchain/core/prompts');

describe('ChatService', () => {
    let service: ChatService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('test-api-key'),
                    },
                },
            ],
        }).compile();

        service = module.get<ChatService>(ChatService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should process message', async () => {
        const mockStream = {
            [Symbol.asyncIterator]: jest.fn().mockReturnValue({
                next: jest.fn().mockResolvedValue({ done: true, value: null }),
            }),
        };

        const mockPrompt = {
            pipe: jest.fn().mockReturnThis(),
            stream: jest.fn().mockReturnValue(mockStream),
        };

        (PromptTemplate.fromTemplate as jest.Mock).mockReturnValue(mockPrompt);
        (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({
            pipe: jest.fn().mockReturnThis(),
        }));

        const result = await service.processMessage('Hello');

        expect(PromptTemplate.fromTemplate).toHaveBeenCalledWith(CHAT_TEMPLATE);
        expect(ChatOpenAI).toHaveBeenCalledWith({
            apiKey: 'test-api-key',
            temperature: CHAT_TEMPERATURE,
            model: CHAT_MODEL,
        });
        expect(mockPrompt.pipe).toHaveBeenCalled();
        expect(mockPrompt.stream).toHaveBeenCalledWith({
            input: 'Hello',
            output_language: CHAT_OUTPUT_LANGUAGE,
        });
        expect(result).toBe(mockStream);
    });
});
