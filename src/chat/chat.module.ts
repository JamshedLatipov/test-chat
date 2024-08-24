import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ChatResolver, ChatService],
  imports: [ConfigModule]
})
export class ChatModule { }