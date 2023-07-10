import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { SearchReviewDto } from './dto/search-review.dto';

const jwt = require('jsonwebtoken');

const apiKey = 'v';

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
        return {status:200, message: "Game added!"};
      } catch (error) {
        return { status: 500, error: error }
      }
    }
    else{
      return {status:400, message: "Fill all fields" };
    }
  }

  async search(token: string, searchReviewDto: SearchReviewDto) {
    const user_id = searchReviewDto.user_id

    try {
      jwt.verify(token, this.configReviewService.get<string>('JWT_SECRET'));

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

          return { status: 200, subscribedgames: { subscribedgames: subscribedgames }, ratings: {ratings: ratings}, gameStatus: {gameStatus: gamesStatus}};
      }
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async searchReviewByGame(token: string, id: number) {
    const reviews = await this.ReviewModel.find({forum_id: id}).limit(5)
    const game = await searchGamesByID(id);
    const reviewsgame= [];
    let totalRating = 0; // Variable to store the sum of all ratings
    if(reviews.length!=0 )
    {
      try {
        jwt.verify(token, this.configReviewService.get<string>('JWT_SECRET'));
        for (const review of reviews) {
          const user = await this.UserModel.findById(review.user_id); 
          reviewsgame.push({username:user.username,rating:review.rating,_id:review._id,user_id:review.user_id,title:review.title,image:game.background_image})
          totalRating += review.rating
        }

        let averageRating = null; // Default value for averageRating when there are no ratings

        if (reviews.length > 0) {
          averageRating = totalRating / reviews.length;
          if (averageRating < 0 || averageRating > 10) {
            averageRating = averageRating.toFixed(2);
          }
        }

        return {status: 200, message: "Reviews searched successfully", reviewsgame,numberOfReviews: reviews.length, averageRating: averageRating.toFixed(2)}
      } catch (error) {
        return { status: 500, error: error }
      }
    }
    else{
      let averageRating = 0;
      return {status: 203, message: "Reviews not found", averageRating}
    } 
  }

  
  async searchReviewByUser(token: string, searchreviewDto: SearchReviewDto) {
    const id = searchreviewDto.user_id;

    try {
      jwt.verify(token, this.configReviewService.get<string>('JWT_SECRET'));
      const user = await this.UserModel.findOne({ _id: id });
      if (!user) {
        return { status: 203, message: "User not found" };
      }
      const reviews = await this.ReviewModel.find({user_id:user._id}).limit(5)
      
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
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async findAll(token: string, ordering: String) {
    try {
      jwt.verify(token, this.configReviewService.get<string>('JWT_SECRET'));
      if(ordering === "releasedate") {
        const reviews = await this.ReviewModel.find({}).sort({createdAt: 'descending'}).limit(5);
        return {status: 200, message: reviews};
      } else {
        const reviews = await this.ReviewModel.find({}).limit(5);
        return {status: 200, message: reviews};
      }
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async findByUser(token: string, user_id: String) {
    const reviews = await this.ReviewModel.find({user_id: user_id}).select('rating title text forum_id').limit(5)
    const reviewsgame= [];

    if(reviews.length!=0 )
    {
      try {
        jwt.verify(token, this.configReviewService.get<string>('JWT_SECRET'));
        for (const review of reviews) {
          const forum = review.forum_id
          const game = await searchGamesByID(forum);
          reviewsgame.push({rating:review.rating, title:review.title, text:review.text, image:game.background_image})
        }
        return {status: 200, message: "Reviews searched successfully", reviewsgame}
      } catch (error) {
        return { status: 500, error: error }
      }
    }
    else{
      return {status: 203, message: "Reviews not found"}
    } 
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