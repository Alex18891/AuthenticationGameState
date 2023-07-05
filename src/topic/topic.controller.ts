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
  searchTopicByUser(@Body() searchTopicDto: SearchTopicDto) {
    return this.topicService.searchTopicByUser(searchTopicDto);
  }

  @Post('searchbytopicid')
  searchTopicByID(@Body() searchTopicIDDto: SearchTopicIDDto) {
    return this.topicService.searchTopicByID(searchTopicIDDto);
  }

  @Post('createcomment')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.topicService.createComment(createCommentDto);
  }

  @Post('likedislike')
  likeTopic(@Body() likeDislikeTopicDto: LikeDislikeTopicDto) {
    return this.topicService.likeDislikeTopic(likeDislikeTopicDto);
  }

  @Get('searchbygameid/:gameID')
  searchTopicByGame(@Param('gameID') id: string) {
    return this.topicService.searchTopicByGame(+id)
  }

  @Get()
  findAll() {
    return this.topicService.findAll();
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
