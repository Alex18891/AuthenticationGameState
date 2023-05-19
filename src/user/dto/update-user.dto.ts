import { CreateUserDto } from './create-user.dto';
import { Length } from 'class-validator';

export class UpdateUserDto {
    @Length(1, 20)
    email: string;

    @Length(1, 20)
    password: string;
}
