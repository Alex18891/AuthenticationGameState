import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeDislikeTopicDto } from './dto/like-dislike-topic.dto';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(@Headers('authorization') authorizationHeader: string, @Body() createTopicDto: CreateTopicDto) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.topicService.create(token, createTopicDto);
    } else return { status: 401, message: "Missing Token" }
  }

  @Get(':id')
  searchTopicsByID(@Headers('authorization') authorizationHeader: string, @Param('id') id: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.topicService.searchTopicsByID(token, id);
    } else return { status: 401, message: "Missing Token" }
  }


  @Post('comments')
  createComment(@Headers('authorization') authorizationHeader: string, @Body() createCommentDto: CreateCommentDto) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.topicService.createComment(token, createCommentDto);
    } else return { status: 401, message: "Missing Token" }
  }

  @Post('likedislike')
  likeTopic(@Headers('authorization') authorizationHeader: string, @Body() likeDislikeTopicDto: LikeDislikeTopicDto) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.topicService.likeDislikeTopic(token, likeDislikeTopicDto);
    } else return { status: 401, message: "Missing Token" }
  }

  @Get()
  search(@Headers('authorization') authorizationHeader: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.topicService.search(token);
    } else return { status: 401, message: "Missing Token" }
  }
}
