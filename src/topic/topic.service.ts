import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { Topic } from './schemas/topic.schema';

@Injectable()
export class TopicService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>, private configUserService: ConfigService, 
  @InjectModel(Topic.name) private TopicModel: Model<Topic>, private configTopicService: ConfigService) { }
  async create(createTopicDto: CreateTopicDto) {
    const name = createTopicDto.name;
    const text = createTopicDto.text;
    //const user_id = createTopicDto.user_id;
    //const forum_id = createTopicDto.forum_id;
    if (name && text) {
      const topic = new this.TopicModel(createTopicDto);
      topic.save();
      return {status:200, message: "Topic Created"};
    }
    else{
      return {status:400, message: "Fill all" };
    }
   
  }

  findAll() {
    return `This action returns all topic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} topic`;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
