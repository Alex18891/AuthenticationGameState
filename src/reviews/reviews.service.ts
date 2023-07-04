import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
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
  constructor(@InjectModel(User.name) private UserModel: Model<User>,private configUserService: ConfigService,
  @InjectModel(Review.name) private ReviewModel: Model<Review>, private configReviewService: ConfigService) {}
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

  async searchReviewByGame(id: number) {
    const reviews = await this.ReviewModel.find({forum_id: id})
    const game = await searchGamesByID(id);
    const reviewsgame= [];
    if(reviews.length!=0 )
    {
      for (const review of reviews) {
        const user = await this.UserModel.findById(review.user_id); 
        reviewsgame.push({username:user.username,rating:review.rating,_id:review._id,user_id:review.user_id,title:review.title,image:game.background_image})
           
      }
  
      return {status: 200, message: "Reviews searched successfully", reviewsgame}
    }
    else{
      return {status: 203, message: "Reviews not found"}
    } 
  }

  
  async searchReviewByUser(searchreviewDto: SearchReviewDto) {
    const id = searchreviewDto.user_id;

    const user = await this.UserModel.findOne({ _id: id });
    if (!user) {
      return { status: 203, message: "User not found" };
    }
    const reviews = await this.ReviewModel.find({user_id:user._id})
    
    const reviewsbyusernames= [];
    if(reviews.length!=0 )
    {
      for (const review of reviews) {
        const game = await searchGamesByID(review.forum_id);
        reviewsbyusernames.push({username:user.username,rating:review.rating,_id:review._id,user_id:review.user_id,title:review.title,createdAt: review.createdAt,text:review.text,image:game.background_image,game_name:game.name,forum_id:review.forum_id})
      }
  
      return {status: 200, message: "Reviews searched successfully",reviewsbyusernames}
    }
    else{
      return {status: 203, message: "Reviews not found"}
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