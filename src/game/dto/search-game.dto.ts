import {Length} from 'class-validator';

export class SearchGameDto {

    @Length(1, 20)
    name: string;

}
