import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/reviews/schemas/review.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { Topic, TopicSchema } from 'src/topic/schemas/topic.schema';
import { ReviewsService } from 'src/reviews/reviews.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }, {name: User.name, schema: UserSchema}, {name: Topic.name, schema: TopicSchema}]), ConfigModule],
  controllers: [GameController],
  providers: [GameService, ReviewsService]
})
export class GameModule {}
