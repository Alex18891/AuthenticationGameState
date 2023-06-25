import { Injectable, flatten } from '@nestjs/common';
import { SearchGameDto } from './dto/search-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

const apiKey = '50cf30549e214193975160de0871baf0';

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
  const url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-metacritic`
  return fetch(url).then((response) => response.json()).then((data) => data.results);
};

@Injectable()
export class GameService {
  async searchgame(searchGameDto:SearchGameDto) {
    const search = searchGameDto.name;
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

  async searchGameByID(searchGameDto:SearchGameDto) {
    const search = searchGameDto.id;
    const game = await searchGamesByID(search);

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

  async findByReleaseDate(ordering: String) {
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

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
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
