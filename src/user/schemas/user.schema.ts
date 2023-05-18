import{Prop,Schema,SchemaFactory }from '@nestjs/mongoose';
import{Document }from 'mongoose';

@ Schema({timestamps:true})
export class User extends Document{
    @Prop()
    username:string;
    @Prop()
    password:string;
    @Prop()
    email:string;
    @Prop()
    country:string;
}

export const UserSchema=SchemaFactory.createForClass(User);