import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private ReviewModel: Model<Review>, private configReviewService: ConfigService) {}
  create(createReviewDto: CreateReviewDto) {
    const rating = createReviewDto.rating;

    if (rating) {
      const review = new this.ReviewModel(createReviewDto);
      review.save();
      return {status:200, message: "Game added!"};
    }
    else{
      return {status:400, message: "Fill all fields" };
    }

  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
