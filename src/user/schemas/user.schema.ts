import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true, type: String })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true, unique: true, type: String })
    email: string;
    @Prop({ required: false })
    country: string;
    @Prop({ required: true, type: String })
    pushToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);