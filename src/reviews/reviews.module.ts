import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewSchema } from './schemas/review.schema';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }, {name: User.name, schema: UserSchema}]), ConfigModule],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
