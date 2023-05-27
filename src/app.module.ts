import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/27017'), ConfigModule.forRoot(), UserModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
