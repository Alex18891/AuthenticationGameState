import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
class Comments {
    @Prop({ type: String, required: true })
    text: string;
  
    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    topic_id: string;
    get createdAt(): Date {
        return this.createdAt;
      }
    get updatedAt(): Date {
    return this.updatedAt;
    }
}

const CommentSchema = SchemaFactory.createForClass(Comments);

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
    @Prop({ type: [CommentSchema], required: false })
    comments: Comments[];
    @Prop({ required: false, default: 0, MIN_VALUE: 0 })
    likes: number;
    @Prop({ required: false, default: 0, MIN: 0 })
    dislikes: number;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);