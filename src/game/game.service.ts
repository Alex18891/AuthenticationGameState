import { Injectable } from '@nestjs/common';
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

@Injectable()
export class GameService {
  async searchgame(searchGameDto:SearchGameDto) {
    const search = searchGameDto.name;
    console.log(search);
    const games = await searchGames(search);
    const namegame = games.map((game) => ({
      name: game.name,
      id: game.id
      // developers: game.developers,
      // released: game.released,
      // platforms: game.platforms,
      // genres: game.genres,
    }))

    if(namegame.length !== 0)
    {
      return {status:200, message:games}
    }
    else{
      return { status: 203, message: "Game not found" };
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
      const { name, id, developers, released: release_date, background_image: image } = game;
      const developerNames = developers.map((developer) => ({
        name: developer.name,
        image: developer.image_background
      }));
      return { status: 200, message:{ name, id, developers: developerNames, release_date, image }}
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
