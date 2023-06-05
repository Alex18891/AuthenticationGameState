import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Topic extends Document {
    @Prop({ required: true, type: String })
    name: string;
    @Prop({ required: true })
    text: string;
    @Prop({ required: true})
    forum_id: number;
    @Prop({ required: true })
    user_id: string;
    @Prop({ required: false, default: 0 })
    likes: number;
    @Prop({ required: false, default: 0 })
    dislikes: number;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);