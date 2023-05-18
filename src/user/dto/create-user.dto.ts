import { IsPositive, Length, Matches, Max } from 'class-validator';

export class CreateUserDto {
    @Length(1, 20)
    username:string;
  
    @Length(1, 20)
    password:string;
  
    @Length(1, 20)
    email:string;
  
    @Length(1, 20)
    country:string;
}
