import { Length } from "class-validator";

export class CreateCommentDto {
    @Length(1, 20)
    text: string;

    user_id: string;

    topic_id: string;
}
