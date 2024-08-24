import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ChatModule } from './chat/chat.module';
import { CONFIG } from './utils/config'
import { ConfigModule } from '@nestjs/config';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    ConfigModule.forRoot({
      load: [CONFIG]
    }),
    ChatModule,
  ],
  providers: [AppResolver]
})
export class AppModule { }