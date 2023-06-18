import { Length } from "class-validator";
import { ObjectId } from "mongoose";
import { LikeDislikeTopicDto } from "./like-dislike-topic.dto";

export class CreateTopicDto {

    @Length(1, 20)
    name: string;

    text: string;

    user_id: string;

    forum_id: number;

    likeDislike: LikeDislikeTopicDto
}
