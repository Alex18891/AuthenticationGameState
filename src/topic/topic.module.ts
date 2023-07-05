import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }, {name: User.name, schema: UserSchema}]), ConfigModule],
  controllers: [TopicController],
  providers: [TopicService]
})
export class TopicModule {}
