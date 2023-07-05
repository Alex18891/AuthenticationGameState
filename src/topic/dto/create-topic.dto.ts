import { Length } from "class-validator";

export class CreateTopicDto {

    @Length(1, 20)
    name: string;

    text: string;

    forum_id: number;
}
