import { Length } from 'class-validator';

export class ChangepwdUserDto {
    @Length(1, 20)
    password: string;
}
