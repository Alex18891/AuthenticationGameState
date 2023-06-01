import { PartialType } from '@nestjs/mapped-types';
import { SearchGameDto } from './search-game.dto';

export class UpdateGameDto extends PartialType(SearchGameDto) {}
