import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { Topic } from './schemas/topic.schema';
import { SearchTopicDto } from './dto/search-topic.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeDislikeTopicDto } from './dto/like-dislike-topic.dto';

const jwt = require('jsonwebtoken');

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
  async create(token: string, createTopicDto: CreateTopicDto) {
    const name = createTopicDto.name;
    const text = createTopicDto.text;
    const likeDislike = 0;
    const username = ""

    if (name && text) {
      try {
        jwt.verify(token, this.configTopicService.get<string>('JWT_SECRET'));
        const topic = new this.TopicModel(createTopicDto);
      topic.save();
      await this.TopicModel.findOneAndUpdate({name: name}, {
        $set: {'likeDislike': {'username': username, 'likeDislike': likeDislike} }
      });
      return {status:200, message: "Topic Created"};
      } catch (error) {
        return { status: 500, error: error }
      }
    }
    else{
      return {status:400, message: "Fill all fields" };
    }
  }

  async searchTopicByUser(token: string,searchTopicDto: SearchTopicDto) {
    const username = searchTopicDto.username;
    try {
      jwt.verify(token, this.configTopicService.get<string>('JWT_SECRET'));
      const user = await this.UserModel.findOne({ username: username });
      if (!user) {
        return { status: 203, message: "User not found" };
      }
      const topics = await this.TopicModel.find({ user_id: user._id }).select('_id text createdAt name forum_id comments');
      const images = [];
      const names = [];
      const commentsbytopicos = []

      for (const topic of topics) {
        
        const forumID = topic.forum_id;
        const comments = topic.comments;
        const game = await searchGamesByID(forumID);
        const { background_image: image, _id:gameid, name: name } = game;
        
        for(const comment of comments)
        { 
          const user = await this.UserModel.findById(comment.user_id); 
          commentsbytopicos.push({username:user.username,topicid:topic.id,gameid:gameid,image:image,createdAt: comment.createdAt});
        }  

        names.push(name);

        
        if (image) {
          images.push(image);
        } else {
          const defaultImage = "null";
          images.push(defaultImage);
        }
      }
      return { status: 200, message: { topics, images, names, commentsbytopicos} };
    }catch (error) {
      return { status: 500, error: error }
    }
  }

  async searchTopicByID(token: string,searchTopicIDDto) {
    const topic_id = searchTopicIDDto.topic_id;
    try {
      jwt.verify(token, this.configTopicService.get<string>('JWT_SECRET'));
    const topics = await this.TopicModel.findOne({ _id: topic_id }).select('topic_id createdAt name text likes dislikes user_id comments.text comments.user_id comments.createdAt likeDislike.likeDislike likeDislike.username').lean();
    const user = await this.UserModel.findById(topics.user_id); 
    const username = user.username;
    const modifiedComments = [];
  
    for (const comment of topics.comments) {
      const username = await this.UserModel.findOne({ _id: comment.user_id }).select('username -_id');
  
      const modifiedComment = { ...comment, username: username.username };
      modifiedComments.push(modifiedComment);
    }
  
    const modifiedTopics = {
      ...topics,
      username, 
      comments: modifiedComments
    };
  
    return { status: 200, message: { topics: modifiedTopics } };
  }catch (error) {
    return { status: 500, error: error }
  }
  }


  async createComment(token: string,createCommentDto: CreateCommentDto) {
    const text = createCommentDto.text;
    const userID = createCommentDto.user_id;
    const topicID = createCommentDto.topic_id;
    try {
      jwt.verify(token, this.configTopicService.get<string>('JWT_SECRET'));
    if (text) {
      
      await this.TopicModel.findByIdAndUpdate({_id: topicID}, {
          $push: {'comments': {"text": text,"user_id": userID} }
      });
      return {status:200, message: "Comment Created"};
    }
    else{
      return {status:400, message: "Fill all fields" };
    }
    }catch (error) {
      return { status: 500, error: error }
    }
  }

  async findAll(token: string,) {
    try {
      jwt.verify(token, this.configTopicService.get<string>('JWT_SECRET'));
    const topics = await this.TopicModel.find({}, {name: 1, _id: 1})
    return {status: 200, message: "Topics searched successfully", topics}
    }catch (error) {
      return { status: 500, error: error }
    }
  }

  async likeDislikeTopic(token: string,likeDislikeTopicDto: LikeDislikeTopicDto) {
    var likes = likeDislikeTopicDto.likes;
    var dislikes = likeDislikeTopicDto.dislikes;
    const topicID = likeDislikeTopicDto.topic_id;
    const username = likeDislikeTopicDto.username;
    const usernameLD = likeDislikeTopicDto.usernameLD;
    const likeDislike = likeDislikeTopicDto.likeDislike;
    try {
      jwt.verify(token, this.configTopicService.get<string>('JWT_SECRET'));

    if(usernameLD == username) {
      await this.TopicModel.findOneAndUpdate({_id: topicID, 'likeDislike': {$elemMatch: {'username': usernameLD}}}, {
        $pull: {'likeDislike': {'username': usernameLD}}
      });
      await this.TopicModel.findOneAndUpdate({_id: topicID}, {
        $push: {'likeDislike': {'username': username, 'likeDislike': likeDislike} }
      });
    } else if(usernameLD != username) {
      await this.TopicModel.findByIdAndUpdate({_id: topicID}, {
        $push: {'likeDislike': {'username': username, 'likeDislike': likeDislike} },
  
      });
    }
    

    await this.TopicModel.findByIdAndUpdate({_id: topicID}, {likes: likes, dislikes: dislikes})
    const likesDislikes = await this.TopicModel.findOne({ _id: topicID }).select('likes dislikes');
    return {status:200, message: {likesDislikes}};
    }catch (error) {
      return { status: 500, error: error }
    }
  }

  async searchTopicByGame(token: string,id: number) {
    try {
      jwt.verify(token, this.configTopicService.get<string>('JWT_SECRET'));
      const topics = await this.TopicModel.find({forum_id: id}, {name: 1, _id: 1})
      return {status: 200, message: "Topics searched successfully", topics}
    }catch (error) {
      return { status: 500, error: error }
    }
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
