import { IsEmail, IsOptional, Length, MinLength } from 'class-validator';

export class CreateUserDto {
    @Length(1, 20)
    username: string;

    @Length(1, 20)
    password: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @MinLength(2)
    country: string;
}
