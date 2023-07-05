import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Review, ReviewSchema } from 'src/reviews/schemas/review.schema';
import { Topic, TopicSchema } from 'src/topic/schemas/topic.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Review.name, schema: ReviewSchema }, { name: Topic.name, schema: TopicSchema }]), ConfigModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
