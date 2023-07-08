import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from 'src/reviews/schemas/review.schema';
import { Topic } from 'src/topic/schemas/topic.schema';
import { User } from 'src/user/schemas/user.schema';

const jwt = require('jsonwebtoken');

const apiKey = '1260124e75cb49e2ad9c2dba5ec02e3a';

const searchGames = async (searchText) => {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchText}&search_exact=true&ordering=-metacritic`
  return fetch(url).then((response) => response.json()).then((data) => data.results);
};  

const searchGamesByReleaseDate = async (order) => {
  var url = null;
  switch (order) {
    case 1: 
      url = `https://api.rawg.io/api/games?key=${apiKey}&dates=${getTodayMinusTwoMonths()},${getToday()}&ordering=-added&exclude_stores=4,8,9&exclude_additions=true`;
      break;
    case -1:
      url = `https://api.rawg.io/api/games?key=${apiKey}&dates=${getToday()},${getTodayPlusOneYear()}&ordering=-added&exclude_stores=4,8,9&exclude_additions=true`;
      break;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const searchGamesByID = async (ID) => {
  const url = `https://api.rawg.io/api/games/${ID}?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const allgames = async()=>{
  const url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating_count,-rating`
  return fetch(url).then((response) => response.json()).then((data) => data.results);
};

@Injectable()
export class GameService {
  constructor(@InjectModel(Review.name) private ReviewModel: Model<Review>, @InjectModel(User.name) private UserModel: Model<User>, @InjectModel(Topic.name) private TopicModel: Model<User>, private configService: ConfigService) { }
  async search(search: string, ordering: string) {
    var gamesOrder = null;
    if (ordering == "releasedate") { //Order filter verification
      gamesOrder = await searchGamesByReleaseDate(1);
      const results = gamesOrder.results.slice(0, 6); //limit to 6 games
      const gameInformation = results.map(game => {
        return {
          id: game.id,
          name: game.name,
          released: game.released,
          image: game.background_image
        };
      });
      return { status: 200, message: gameInformation }
    } else if (ordering == "-releasedate") { //Order filter verification
      gamesOrder = await searchGamesByReleaseDate(-1);
      const results = gamesOrder.results.slice(0, 6); //limit to 6 games
      const gameInformation = results.map(game => {
        return {
          id: game.id,
          name: game.name,
          released: game.released,
          image: game.background_image
        };
      });
      return { status: 200, message: gameInformation }
    } else { //If ordering filter does not exist (normal search)
      const games = await searchGames(search);

      const namegame = games.map(function(game) {
        return game.name;
      })
  
      const idgame = games.map(function(game) {
        return game.id;
      })
  
      const allinformationgames = await allgames();
      const metacritic = allinformationgames.map((game)=> ({
        background_img: game.background_image,
        id:game.id
      }))
      const populargames = []
      let tamanho = 6;
      for(let l=0;l<tamanho; l++)
      {
        const background_img = metacritic[l].background_img;  
        const id = metacritic[l].id; 
        if(background_img!=null)
        {
          populargames.push(background_img,id);
        }
        else{
          tamanho = tamanho + 1
        }
      }
     
      if(namegame.length !== 0)
      {
        return {status:200,id:idgame, game:namegame,populargames:populargames}
      }
      else{
        return { status: 203, game: "Game not found" };
      }
    }
  }

  async searchById(id: string) {
    const game = await searchGamesByID(id);

    if(game.detail === "Not found.")
    {
      return { status: 404, message: "Game not found" };
    }
    else{
      const { name, id, developers, released: release_date, background_image: image,background_image_additional:imageadd,ratings_count, description, platforms } = game;
      const developerNames = developers.map((developer) => ({
        name: developer.name,
        image: developer.image_background
      }));
      return { status: 200, message:{ name, id, developers: developerNames, release_date, image, description, platforms,imageadd,ratings_count }}
    }
  }

  async searchByReleaseDate(ordering: string) {
    var games = null;
    if (ordering == "releasedate") {
      games = await searchGamesByReleaseDate(1);
    } else if (ordering == "-releasedate") {
      games = await searchGamesByReleaseDate(-1);
    } else return { status: 400, message: "Wrong filter"}
    
      const results = games.results.slice(0, 6); //limit to 6 games
      const gameInformation = results.map(game => {
        return {
          id: game.id,
          name: game.name,
          released: game.released,
          image: game.background_image
        };
      });
      return { status: 200, message: gameInformation }
  }

  async searchReviewsByGame(token: string, id: number) {
    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const reviews = await this.ReviewModel.find({forum_id: id})
      const game = await searchGamesByID(id);
      const reviewsgame= [];
      if(reviews.length!=0 )
      {
        for (const review of reviews) {
          const user = await this.UserModel.findById(review.user_id); 
          reviewsgame.push({username:user.username,rating:review.rating,_id:review._id,user_id:review.user_id,title:review.title,text:review.text,image:game.background_image})
            
        }
        return {status: 200, message: "Reviews searched successfully", reviewsgame,numberOfReviews: reviews.length}
      }
      else{
        return {status: 203, message: "Reviews not found"}
      } 
    } catch (error) {
      return { status: 500, error: error }
    }
  }
  async searchTopicsByGame(token: string, id: number) {
    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const topics: Topic[] = await this.TopicModel.find({forum_id: id}, {name: 1, _id: 1, text:1,createdAt:1,user_id:1})

      const topicsWithUsername = [];

      for (const topic of topics) {
        const user = await this.UserModel.findById(topic.user_id);
        topicsWithUsername.push({_id: topic._id, name: topic.name, text: topic.text, createdAt: topic.createdAt, user_id: topic.user_id, username: user.username});
      }
      
      return {status: 200, message: "Topics searched successfully", topics:topicsWithUsername}
    }catch (error) {
      return { status: 500, error: error }
    }
  }
}

function getTodayMinusTwoMonths() {
  var today = new Date();
  today.setMonth(today.getMonth() - 2);

  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0');
  var day = String(today.getDate()).padStart(2, '0');

  var formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
}

function getToday() {
  var today = new Date();

  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0');
  var day = String(today.getDate()).padStart(2, '0');

  var formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
}

function getTodayPlusOneYear() {
  var today = new Date();
  today.setFullYear(today.getFullYear() + 1);

  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0');
  var day = String(today.getDate()).padStart(2, '0');

  var formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
}
