import {Length} from 'class-validator';

export class SearchGameDto {

    @Length(1, 20)
    name: string;

    @Length(1, 20)
    id: number;
}
