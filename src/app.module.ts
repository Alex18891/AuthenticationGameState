import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { TopicModule } from './topic/topic.module';
import { ReviewsModule } from './reviews/reviews.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://mongo-db:27017'), ConfigModule.forRoot(), UserModule, GameModule, TopicModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
