import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }, {name: User.name, schema: UserSchema}]), ConfigModule],
  controllers: [TopicController, UserController],
  providers: [TopicService, UserService]
})
export class TopicModule {}
