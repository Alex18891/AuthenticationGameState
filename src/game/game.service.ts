import { Injectable } from '@nestjs/common';
import { SearchGameDto } from './dto/search-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';


const apiKey = '9c00b654361b4202be900194835b8665';

const searchGames = async (searchText) => {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchText}&search_exact=true&ordering=-metacritic`
  return fetch(url).then((response) => response.json()).then((data) => data.results);
};  

@Injectable()
export class GameService {
  async searchgame(searchGameDto:SearchGameDto) {
    const search = searchGameDto.name;
    console.log(search);
    const games = await searchGames(search);
    const namegame = games.map((game) => ({
      name: game.name,
    //  developers: game.developers,
    //  released: game.released,
     // platforms: game.platforms,
     // genres: game.genres,
    }))

    if(namegame.length !== 0)
    {
      return {status:200, message:namegame}
    }
    else{
      return { status: 203, message: "Game not found" };
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
