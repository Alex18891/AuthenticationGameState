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
    @Prop({ required: false, type: String })
    pushToken: string;
    @Prop({ required: false, type: Array})
    wishlist: number[];
    get createdAt(): Date {
        return this.createdAt;
      }
    get updatedAt(): Date {
    return this.updatedAt;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);