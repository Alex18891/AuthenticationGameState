import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { SearchGameDto } from './dto/search-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('search')
  search(@Body() searchGameDto: SearchGameDto) {
    return this.gameService.searchgame(searchGameDto);
  }

  @Post('searchbyid')
  searchByID(@Body() searchGameDto: SearchGameDto) {
    return this.gameService.searchGameByID(searchGameDto);
  }

  @Get()
  findbyReleaseDate(@Query('ordering') ordering: String) {
    return this.gameService.findByReleaseDate(ordering);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
