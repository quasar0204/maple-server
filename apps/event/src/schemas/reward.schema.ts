import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.schema';

export type RewardDocument = Reward & Document;

export type RewardItem = {
  type: 'item' | 'point' | 'coupon';
  value: string;
  quantity: number;
};

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: Types.ObjectId, ref: Event.name, required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Array, required: true })
  rewards: RewardItem[];
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
