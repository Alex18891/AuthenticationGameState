import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

const jwt = require('jsonwebtoken');

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>,private configUserService: ConfigService,
  @InjectModel(Review.name) private ReviewModel: Model<Review>, private configReviewService: ConfigService) {}
  async create(token: string, createReviewDto: CreateReviewDto) {
    const rating = createReviewDto.rating;
    const forum_id = createReviewDto.forum_id
    const user_id = createReviewDto.user_id

    if (rating >= 0 && rating <= 10) {
      try {
        if(await this.ReviewModel.findOne({forum_id: forum_id, user_id: user_id})) return { status: 409, message: "Game is already reviewed" };
        jwt.verify(token, this.configReviewService.get<string>('JWT_SECRET'));
        const review = new this.ReviewModel(createReviewDto);
        review.save();
        return {status: 200, message: "Game added!"};
      } catch (error) {
        return { status: 500, error: error }
      }
    }
    else{
      return {status:400, message: "Fill all fields" };
    }
  }

  async search(token: string, ordering: String) {
    try {
      jwt.verify(token, this.configReviewService.get<string>('JWT_SECRET'));
      if(ordering === "releasedate") {
        const reviews = await this.ReviewModel.find({}).sort({createdAt: 'descending'});
        return {status: 200, message: reviews};
      } else {
        const reviews = await this.ReviewModel.find({});
        return {status: 200, message: reviews};
      }
    } catch (error) {
      return { status: 500, error: error }
    }
  }
}