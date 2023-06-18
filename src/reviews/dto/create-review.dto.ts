import { Max, Min } from "class-validator";

export class CreateReviewDto {

    @Min(0)
    @Max(10)
    rating: number;

    title: string;

    text: string;

    gameStatus: number;

    user_id: string;

    forum_id: number;
}