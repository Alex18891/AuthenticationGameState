import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Headers('authorization') authorizationHeader: string, @Body() createReviewDto: CreateReviewDto) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.reviewsService.create(token, createReviewDto);
    } else return { status: 401, message: "Missing Token" }
  }

  @Get()
  search(@Headers('authorization') authorizationHeader: string, @Query('ordering') ordering: String) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.reviewsService.search(token, ordering);
    } else return { status: 401, message: "Missing Token" }
  }
}