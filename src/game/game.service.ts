import { Injectable, flatten } from '@nestjs/common';
import { SearchGameDto } from './dto/search-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

const apiKey = '9c00b654361b4202be900194835b8665';

const searchGames = async (searchText) => {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchText}&search_exact=true&ordering=-metacritic`
  return fetch(url).then((response) => response.json()).then((data) => data.results);
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
      const { name, id, developers, released: release_date, background_image: image, description, platforms } = game;
      const developerNames = developers.map((developer) => ({
        name: developer.name,
        image: developer.image_background
      }));
      return { status: 200, message:{ name, id, developers: developerNames, release_date, image, description, platforms }}
    }
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
