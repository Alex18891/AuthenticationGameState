import { BadRequestException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/forgotpwd-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChangepwdUserDto } from './dto/changepwd-user.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateUserTokenDto } from './dto/changetoken-user.dto';
import { WishlistDto } from './dto/wishlist.dto';
import { Review } from '../reviews/schemas/review.schema';
import { Topic } from 'src/topic/schemas/topic.schema';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const apiKey = '9c00b654361b4202be900194835b8665';

const searchGamesByID = async (ID) => {
  const url = `https://api.rawg.io/api/games/${ID}?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};  

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>, @InjectModel(Review.name) private ReviewModel: Model<Review>, @InjectModel(Topic.name) private TopicModel: Model<Topic>, private configService: ConfigService) { }
  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const email = createUserDto.email;
    const passwordEncrypt = await bcrypt.hash(password, 10);
    const username = createUserDto.username;
    const usernameprevious = await this.UserModel.findOne({ username });
    const emailprevious = await this.UserModel.findOne({ email });
    if (!usernameprevious && !emailprevious) {
      createUserDto.password = passwordEncrypt;
      const user = new this.UserModel(createUserDto);
      user.save();
      return {status:200, message: "User Created"};
    }
    else{
      return {status:203, message: "Username or email already exists" };
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const password = loginUserDto.password;
    const username = loginUserDto.username;
    const userdb = await this.UserModel.findOne({ username });

    if (!userdb) {
      return { status: 203, message: "User not found" };
    }

    const passwordvalid = await bcrypt.compare(password, userdb.password);

    if (passwordvalid) {
      try {
        const token=jwt.sign(
          {
              id:userdb._id, 
              username:userdb.username
          }, 
            this.configService.get<string>('JWT_SECRET'),
          {
              // Autenticação expira em 30 dias
              expiresIn: '30d'
          })
          return { status: 200, message: "User logged in", id:userdb._id, username:userdb.username, token }
      } catch (error) {
        return { status: 500, error: error }
      }
      
    } else {
      return { status: 400, message: "Wrong password" }
    }
  }

  async forgotPassword(updateUserDto: UpdateUserDto) {
    const email = updateUserDto.email

    const sendResetPasswordMail = async (email, link) => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'noreplygamestate@gmail.com',//email responsible to send the email
            pass: this.configService.get<string>('NODEMAILER_PASSWORD')//password of that email
          }
        });
        const mailOptions = {
          from: 'noreplygamestate@gmail.com',
          to: email,//email that is defined to the user input 
          subject: 'Forgot Password',
          //html: You just received a mail!
          html: '<p> Link to reset your password: <br/><br/> <a href="' + link + '">' + link + '</a>'
        }
        transporter.sendMail(mailOptions)
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    try {
      const user = await this.UserModel.findOne({ email }); //see if the email is in the mongodatabase
      if (!user) {
        throw new NotFoundException('User not found');
      }
      else {
        const token = await jwt.sign(
          {
            id: user._id,
            email: user.email
          },
          this.configService.get<string>('JWT_SECRET'),
          {
            expiresIn: '10m'
          });
        const link = `http://localhost:3000/user/changepwd/${user._id}/${token}`;
        sendResetPasswordMail(email, link);
        return {status: 200, message: 'Now you can verify your email'};
      }
    } catch (error) {
      return error
    }
  }

  async changePasswordRender(@Param('id') id, @Param('token') token) {
    const userData = await this.UserModel.findOne({ _id: id }); //see if the id was created

    if (!userData) {
      return { token: token, status: 203, message: "User not found" };
    }

    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET')); // verify token
      return { token: token, status:200, message: "Verified" };
    } catch (error) {
      return { token: token,status:400, message: "Something went wrong" };
    }
  }

  async changePassword(changepwdUserDto: ChangepwdUserDto) {
    const password = changepwdUserDto.password;
    const token = changepwdUserDto.token;

    try {
      const user = jwt.verify(token, this.configService.get<string>('JWT_SECRET')); // verify a token symmetric
      const userData = await this.UserModel.findOne({ _id: user.id });
      if (!userData) {
        return { status: 203, message: "User not found" };
      }
      const encryptedPassword = await bcrypt.hash(password, 10);//encrypt the password
      await this.UserModel.updateOne(
        { _id: user.id },
        { $set: { "password": encryptedPassword } }
      )
      return { status:200 };
    } catch (error) {
      return { status:400, message: "Something went wrong"};
    }
  }

  async searchUserByID(token: string, id: string) {
    const user = await this.UserModel.findOne({_id: id}).select('pushToken -_id')
    const userforeal = await this.UserModel.findOne({_id: id})
    if (user) {
      try {
        jwt.verify(token, this.configService.get<string>('JWT_SECRET'))
        return { status: 200, message: {user,createdAt: userforeal.createdAt,country:userforeal.country} }
      } catch (error) {
        return { status: 500, error: error }
      }
    } else {
      return { status: 203, message: "User not found"}
    }
  }

  async updateUserPushToken(token: string, id: string, updateUserTokenDto: UpdateUserTokenDto) {
    const pushToken = updateUserTokenDto.pushToken
    const user = await this.UserModel.findOneAndUpdate({_id: id}, {pushToken: pushToken})
    if (user) {
      try {
        jwt.verify(token, this.configService.get<string>('JWT_SECRET'))
        return { status: 200, message: "Token updated" }
      } catch (error) {
        return { status: 500, error: error }
      }
    } else {
      return { status: 203, message: "User not found" }
    }
  }

  async addWishlistItem(token: string, wishlistDto: WishlistDto, id: string) {
    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const user = await this.UserModel.findByIdAndUpdate(id);
      if (!user) {
        return { status: 203, message: "User not found" };
      } else if(user && user.wishlist)
      {
        if (!user.wishlist.includes(wishlistDto.game_id)) {
          const userWishlist = await this.UserModel.findByIdAndUpdate(id, { $push: { wishlist: wishlistDto.game_id}}, { new: true });
          return { status: 201, message: "Game added to wishlist", user: userWishlist };
        }
        else {
          return { status: 409, message: "Game already in the wishlist"};
        }
      } else
      {
        const userWishlist = await this.UserModel.findByIdAndUpdate(id, { $push: { wishlist: wishlistDto.game_id}}, { new: true });
        return { status: 201, message: "Game added to wishlist", user: userWishlist };
      }
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async removeWishlistItem(token: string, userId: string, gameId: number) {
    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const user = await this.UserModel.findByIdAndUpdate(userId);
      if (!user) {
        return { status: 203, message: "User not found" };
      } else if(user && user.wishlist)
      {
        if (!user.wishlist.includes(gameId))
          return { status: 404, message: "Game not found in the wishlist"};
        else {
          await this.UserModel.findByIdAndUpdate(userId, { $pull: { wishlist: gameId}}, { new: true });
          return { status: 204, message: "Game removed from wishlist"};
        }
      } else
      {
        return { status: 404, message: "Game not found in the wishlist"}
      }
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async searchReviewsByUser(token: string, id: string) {
    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
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
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async searchWishlistByID(token:string,id:string){
    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const user = await this.UserModel.findByIdAndUpdate(id);
      if (!user) {
        return { status: 203, message: "User not found" };
      } else 
      {
        const wishlistbyusernames= [];
        const wishlists = user.wishlist;
        for (const wishlist of wishlists) {
          const game = await searchGamesByID(wishlist);
          wishlistbyusernames.push({image:game.background_image})
        }
          return { status: 200, message: user.wishlist,wishlistbyusernames};
      
      } 
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async searchSubscribedGames(token: string, id: string) {
    
    try {
      await this.UserModel.findOne({ _id: id })
    } catch (error) {
      return { status: 500, error: error }
    }

    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));

      const reviews = await this.ReviewModel.find({ user_id: id }).sort({'createdAt': -1}).select('forum_id rating gameStatus').limit(6);
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
    } catch (error) {
      return { status: 500, error: error }
    }
  }

  async searchTopicsByUser(token: string, username: string) {
    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const user = await this.UserModel.findOne({ username: username });
      if (!user) {
        return { status: 203, message: "User not found" };
      }
      const topics = await this.TopicModel.find({ user_id: user._id }).select('_id text createdAt name forum_id comments');
      const images = [];
      const names = [];
      const commentsbytopicos = []

      for (const topic of topics) {
        
        const forumID = topic.forum_id;
        const comments = topic.comments;
        const game = await searchGamesByID(forumID);
        const { background_image: image, _id:gameid, name: name } = game;
        
        for(const comment of comments)
        { 
          const user = await this.UserModel.findById(comment.user_id); 
          commentsbytopicos.push({username:user.username,topicid:topic.id,gameid:gameid,image:image,createdAt: comment.createdAt});
        }  

        names.push(name);

        
        if (image) {
          images.push(image);
        } else {
          const defaultImage = "null";
          images.push(defaultImage);
        }
      }
      return { status: 200, message: { topics, images, names, commentsbytopicos} };
    }catch (error) {
      return { status: 500, error: error }
    }
  }
}
