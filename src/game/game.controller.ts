import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  search(@Query('search') search: string, @Query('ordering') ordering: string) {
    return this.gameService.search(search, ordering);
  }

  @Get(':id')
  searchById(@Param('id') id: string) {
    return this.gameService.searchById(id);
  }

  @Get(':id/reviews')
  searchReviewsByGame(@Headers('authorization') authorizationHeader: string, @Param('id') id: number) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.gameService.searchReviewsByGame(token, id)
    } else return { status: 401, message: "Missing Token" }
  }

  @Get(':id/topics')
  searchTopicsByGame(@Headers('authorization') authorizationHeader: string, @Param('id') id: number) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.gameService.searchTopicsByGame(token, id)
    } else return { status: 401, message: "Missing Token" }
  }
}
