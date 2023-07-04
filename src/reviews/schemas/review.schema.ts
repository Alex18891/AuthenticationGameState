import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
    @Prop({ required: true, type: Number })
    rating: number;
    @Prop({ type: String, required: false })
    text: string;
    @Prop({ type: Number, required: true})
    forum_id: number;
    @Prop({ type: String, required: true })
    user_id: string;
    @Prop({ type: String, required: true })
    title: string;
    @Prop({ type: Number, required: false })
    gameStatus: number;
    get createdAt(): Date {
        return this.createdAt;
      }
    get updatedAt(): Date {
    return this.updatedAt;
    }
}

export const ReviewSchema = SchemaFactory.createForClass(Review);