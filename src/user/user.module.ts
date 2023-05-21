import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), ConfigModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
