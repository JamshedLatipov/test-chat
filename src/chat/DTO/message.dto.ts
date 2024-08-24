import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class MessageInputDTO {
    @IsNotEmpty()
    @IsString()
    @Field()
    user_query: string;
}


@ObjectType()
export class MessageDTO {
    @Field()
    message: string;

    @Field()
    created_at: string;

    // TODO: should be implemented & extended in near feature :)

    @Field()
    read_at: string;

    @Field()
    sended_by: string
}
