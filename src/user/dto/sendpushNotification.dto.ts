import { Length } from 'class-validator';

export class SendPushNotificationDto {
    @Length(1, 20)
    pushToken: string;

    body: string;

    title: string;

    topicId: string;

    gameId: number;
}
