import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SearchReviewDto } from './dto/search-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('create')
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Post('getreviewsbyuser')
  searchReview(@Body() searchReviewDto: SearchReviewDto) {
    return this.reviewsService.search(searchReviewDto);
  }

  @Get('searchbyid/:gameID')
  searchReviewByGame(@Param('gameID') id: string) {
    return this.reviewsService.searchReviewByGame(+id)
  }

  @Post('searchbyuser')
  searchReviewByUser(@Body() searchreviewDto: SearchReviewDto) {
    return this.reviewsService.searchReviewByUser(searchreviewDto)
  }

  @Get()
  findAll(@Query('ordering') ordering: String) {
    return this.reviewsService.findAll(ordering);
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