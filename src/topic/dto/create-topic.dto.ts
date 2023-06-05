import { Length } from "class-validator";

export class CreateTopicDto {

    @Length(1, 20)
    name: string;

    text: string;

    user_id: string;

    forum_id: number;

}
