import { Length } from 'class-validator';

export class LoginUserDto {
    @Length(1, 20)
    username:string;
  
    @Length(1, 20)
    password:string;
}
