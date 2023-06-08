import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { Topic } from './schemas/topic.schema';
import { SearchTopicDto } from './dto/search-topic.dto';
import { SearchTopicIDDto } from './dto/search-topic-id.dto';

const apiKey = '9c00b654361b4202be900194835b8665';

const searchGamesByID = async (ID) => {
  const url = `https://api.rawg.io/api/games/${ID}?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

@Injectable()
export class TopicService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>, private configUserService: ConfigService, 
  @InjectModel(Topic.name) private TopicModel: Model<Topic>, private configTopicService: ConfigService) { }
  async create(createTopicDto: CreateTopicDto) {
    const name = createTopicDto.name;
    const text = createTopicDto.text;

    if (name && text) {
      const topic = new this.TopicModel(createTopicDto);
      topic.save();
      return {status:200, message: "Topic Created"};
    }
    else{
      return {status:400, message: "Fill all fields" };
    }
  }

  async searchTopicByUser(searchTopicDto: SearchTopicDto) {
    const username = searchTopicDto.username;

    const user = await this.UserModel.findOne({ username: username });
    if (!user) {
      return { status: 203, message: "User not found" };
    }

    const topics = await this.TopicModel.find({ user_id: user._id }).select('_id name forum_id');
    const images = [];

    for (const topic of topics) {
      const forumID = topic.forum_id;
      const game = await searchGamesByID(forumID);
      const { background_image: image } = game;
      
      if (image) {
        images.push(image);
      } else {
        const defaultImage = "null";
        images.push(defaultImage);
      }
    }
    return { status: 200, message: { topics, images } };
  }

  async searchTopicByID(searchTopicIDDto: SearchTopicIDDto) {
    const topic_id = searchTopicIDDto.topic_id;

    const topics = await this.TopicModel.findOne({ _id: topic_id }).select('topic_id name text');

    return { status: 200, message: { topics } };
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
