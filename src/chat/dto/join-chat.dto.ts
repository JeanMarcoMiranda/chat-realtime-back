import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class JoinChatDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    nickname: string;
}