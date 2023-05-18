import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';

const bcrypt = require('bcryptjs')

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>){}
  async  create(createUserDto: CreateUserDto): Promise<User>{
    const password = createUserDto.password;
    const passwordEncrypt=await bcrypt.hash(password,10);
    createUserDto.password = passwordEncrypt;
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }

  async login(loginUserDto: LoginUserDto): Promise<User>{
    const password = loginUserDto.password;
    const username=loginUserDto.username;
    const userdb = await this.UserModel.findOne({username});
    const passwordvalid = await bcrypt.compare(password,userdb.password);
    if (!userdb) {
      throw new NotAcceptableException('could not find the user');
    }
    if(userdb && passwordvalid)
    {
      return userdb;  
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
