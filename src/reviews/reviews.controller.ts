import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SearchReviewDto } from './dto/search-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('create')
  create(@Headers('authorization') authorizationHeader: string, @Body() createReviewDto: CreateReviewDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.reviewsService.create(token, createReviewDto);
  }

  @Post('getreviewsbyuser')
  searchReview(@Headers('authorization') authorizationHeader: string, @Body() searchReviewDto: SearchReviewDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.reviewsService.search(token, searchReviewDto);
  }

  @Get('searchbyid/:gameID')
  searchReviewByGame(@Headers('authorization') authorizationHeader: string, @Param('gameID') id: string) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.reviewsService.searchReviewByGame(token, +id)
  }

  @Post('searchbyuser')
  searchReviewByUser(@Headers('authorization') authorizationHeader: string, @Body() searchreviewDto: SearchReviewDto) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.reviewsService.searchReviewByUser(token, searchreviewDto)
  }

  @Get()
  findAll(@Headers('authorization') authorizationHeader: string, @Query('ordering') ordering: String) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.reviewsService.findAll(token, ordering);
  }

  @Get(':userID')
  findByUser(@Headers('authorization') authorizationHeader: string, @Param('userID') user_id: string) {
    const token = authorizationHeader.replace('Bearer ', '');
    return this.reviewsService.findByUser(token, user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}