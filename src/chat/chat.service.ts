import { Injectable } from '@nestjs/common';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/utils/config';
import { CHAT_TEMPERATURE, CHAT_TEMPLATE, CHAT_MODEL, CHAT_OUTPUT_LANGUAGE } from './chat.const';
import { AIMessageChunk } from '@langchain/core/messages';
import { IterableReadableStream } from '@langchain/core/dist/utils/stream';


@Injectable()
export class ChatService {

    constructor(private readonly _configService: ConfigService<IConfig>) { }

    async processMessage(message: string): Promise<IterableReadableStream<AIMessageChunk>> {
        try {
            const prompt = PromptTemplate.fromTemplate(CHAT_TEMPLATE);

            const model = new ChatOpenAI({
                apiKey: this._configService.get<string>('OPEN_AI_KEY'),
                temperature: CHAT_TEMPERATURE,
                model: CHAT_MODEL,
                streaming: true,
            }, {});

            const chain = prompt.pipe(model);

            return chain.stream({
                input: message,
                output_language: CHAT_OUTPUT_LANGUAGE,
            });

        } catch (e: unknown) {
            console.log(e);
        }
    }
}