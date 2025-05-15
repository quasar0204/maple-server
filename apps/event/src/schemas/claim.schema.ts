import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.schema';

export type ClaimDocument = Claim & Document;

@Schema({ timestamps: true })
export class Claim {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: Event.name, required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  status: 'SUCCESS' | 'FAILED' | 'PENDING';

  @Prop({ required: true })
  reason: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
