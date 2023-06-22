import { Length } from 'class-validator';

export class UpdateUserTokenDto {
    @Length(1, 20)
    pushToken: string;
}
