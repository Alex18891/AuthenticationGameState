import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { SearchReviewDto } from './dto/search-review.dto';

const apiKey = '9c00b654361b4202be900194835b8665';

const searchGamesByID = async (ID) => {
  const url = `https://api.rawg.io/api/games/${ID}?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};  

const allgames = async()=>{
  const url = `https://api.rawg.io/api/games?key=${apiKey}`
  return fetch(url).then((response) => response.json()).then((data) => data.results);
};

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private ReviewModel: Model<Review>, private configReviewService: ConfigService) {}
  create(createReviewDto: CreateReviewDto) {
    const rating = createReviewDto.rating;

    if (rating >= 0 && rating <= 10) {
      const review = new this.ReviewModel(createReviewDto);
      review.save();
      return {status:200, message: "Game added!"};
    }
    else{
      return {status:400, message: "Fill all fields" };
    }

  }

  async search(searchReviewDto: SearchReviewDto) {
    const user_id = searchReviewDto.user_id

    const reviews = await this.ReviewModel.find({ user_id: user_id }).sort({'createdAt': -1}).select('forum_id rating gameStatus').limit(6);
    const subscribedgames = []
    const ratings = []
    const gamesStatus = []

    for (const review of reviews) {
        const gameID = review.forum_id
        const rating = review.rating
        const gameStatus = review.gameStatus
        const reviewGamesID = await searchGamesByID(gameID);
        const gameImage = reviewGamesID.background_image
        subscribedgames.push(gameImage, gameID)
        ratings.push(rating)
        gamesStatus.push(gameStatus)
    }
    return { status: 200, subscribedgames: { subscribedgames: subscribedgames }, ratings: {ratings: ratings}, gameStatus: {gameStatus: gamesStatus}};
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
