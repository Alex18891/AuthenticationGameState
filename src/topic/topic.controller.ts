import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { SearchTopicDto } from './dto/search-topic.dto';
import { SearchTopicIDDto } from './dto/search-topic-id.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeDislikeTopicDto } from './dto/like-dislike-topic.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post('create')
  create(@Headers('authorization') authorizationHeader: string, @Body() createTopicDto: CreateTopicDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.topicService.create(token, createTopicDto);
  }

  @Post('searchbyid')
  searchTopicByUser(@Headers('authorization') authorizationHeader: string, @Body() searchTopicDto: SearchTopicDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.topicService.searchTopicByUser(token,searchTopicDto);
  }

  @Post('searchbytopicid')
  searchTopicByID(@Headers('authorization') authorizationHeader: string, @Body() searchTopicIDDto: SearchTopicIDDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.topicService.searchTopicByID(token,searchTopicIDDto);
  }

  @Post('createcomment')
  createComment(@Headers('authorization') authorizationHeader: string,@Body() createCommentDto: CreateCommentDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.topicService.createComment(token,createCommentDto);
  }

  @Post('likedislike')
  likeTopic(@Headers('authorization') authorizationHeader: string,@Body() likeDislikeTopicDto: LikeDislikeTopicDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.topicService.likeDislikeTopic(token,likeDislikeTopicDto);
  }

  @Get('searchbygameid/:gameID')
  searchTopicByGame(@Headers('authorization') authorizationHeader: string,@Param('gameID') id: string) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.topicService.searchTopicByGame(token,+id)
  }

  @Get()
  findAll(@Headers('authorization') authorizationHeader: string) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.topicService.findAll(token);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicService.remove(+id);
  }
}
