import { Injectable, flatten } from '@nestjs/common';
import { SearchGameDto } from './dto/search-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';


const apiKey = '9c00b654361b4202be900194835b8665';

const searchGames = async (searchText) => {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchText}&search_exact=true&ordering=-metacritic`
  return fetch(url).then((response) => response.json()).then((data) => data.results);
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
    const allinformationgames = await allgames();
    const metacritic = allinformationgames.map(function(game) {
      return  game.background_image;
    })

    const populargames = []
    let tamanho = 6;
    for (let i=0;i<tamanho; i++)
    {
      if(metacritic[i]!=null)
      {
        populargames.push(metacritic[i]);
      } 
      else{
        tamanho = tamanho + 1
      }
    }


    if(namegame.length !== 0)
    {
      return {status:200, game:namegame,populargames:populargames}
    }
    else{
      return { status: 203, game: "Game not found" };
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
