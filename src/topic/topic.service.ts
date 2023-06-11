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
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeDislikeTopicDto } from './dto/like-dislike-topic.dto';

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

    const topics = await this.TopicModel.find({ user_id: user._id }).select('_id name forum_id comments');
    const images = [];
    const commentsbytopicos = []
    for (const topic of topics) {
      const commentopic = []
      const forumID = topic.forum_id;
      const comment = topic.comments;
      const game = await searchGamesByID(forumID);
      const { background_image: image } = game;
      
      for(const com of comment)
      { 
        const user = await this.UserModel.findById(com.user_id);
        commentopic.push({username:user.username});
      }  
      commentsbytopicos.push(topic.id,commentopic);
      
      if (image) {
        images.push(image);
      } else {
        const defaultImage = "null";
        images.push(defaultImage);
      }
    }
    return { status: 200, message: { topics, images,commentsbytopicos } };
  }

  async searchTopicByID(searchTopicIDDto) {
    const topic_id = searchTopicIDDto.topic_id;
    const topics = await this.TopicModel.findOne({ _id: topic_id }).select('topic_id name text likes dislikes comments.text comments.user_id comments.createdAt').lean();
  
    const modifiedComments = [];
  
    for (const comment of topics.comments) {
      const username = await this.UserModel.findOne({ _id: comment.user_id }).select('username -_id');
  
      const modifiedComment = { ...comment, username: username.username };
      modifiedComments.push(modifiedComment);
    }
  
    const modifiedTopics = {
      ...topics,
      comments: modifiedComments
    };
  
    return { status: 200, message: { topics: modifiedTopics } };
  }


  async createComment(createCommentDto: CreateCommentDto) {
    const text = createCommentDto.text;
    const userID = createCommentDto.user_id;
    const topicID = createCommentDto.topic_id;

    if (text) {
      await this.TopicModel.findByIdAndUpdate({_id: topicID}, {
          $push: {'comments': {"text": text,"user_id": userID} }
      });
      return {status:200, message: "Comment Created"};
    }
    else{
      return {status:400, message: "Fill all fields" };
    }
  }

  async findAll() {
    const topics = await this.TopicModel.find({}, {name: 1, _id: 1})
    return {status: 200, message: "Topics searched successfully", topics}
  }
  async likeDislikeTopic(likeDislikeTopicDto: LikeDislikeTopicDto) {
    var likes = likeDislikeTopicDto.likes;
    var dislikes = likeDislikeTopicDto.dislikes;
    const topicID = likeDislikeTopicDto.topic_id;

    console.log("likes", likes)
    console.log("dislikes", dislikes)
    console.log("\n")

    await this.TopicModel.findByIdAndUpdate({_id: topicID}, {likes: likes, dislikes: dislikes})
    const likesDislikes = await this.TopicModel.findOne({ _id: topicID }).select('likes dislikes');
    return {status:200, message: {likes}};
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
