import { Resolver, Mutation, Args, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { PubSub } from 'graphql-subscriptions';
import { MessageDTO, MessageInputDTO } from './DTO/message.dto';

const pubSub = new PubSub();

@Resolver(() => MessageDTO)
export class ChatResolver {
    constructor(private readonly chatService: ChatService) { }

    @Mutation(() => MessageDTO)
    async sendMessage(@Args('message') message: MessageInputDTO): Promise<boolean> {
        const stream = await this.chatService.processMessage(message.user_query);
        for await (const chunk of stream) {
            pubSub.publish('messageReceived', { messageReceived: chunk });
        }
        return true;
    }

    @Subscription(() => String, {
        resolve: value => value.messageReceived,
    })
    messageReceived() {
        return pubSub.asyncIterator('messageReceived');
    }
}