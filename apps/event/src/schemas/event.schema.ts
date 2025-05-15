import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

export type Condition =
  | {
      type: 'comparison';
      field: string;
      operator: '>=' | '<=' | '>' | '<' | '==' | '!=';
      value: number | string;
    }
  | {
      type: 'achievement';
      achievementId: string;
    };

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Array, required: true })
  conditions: Condition[];

  @Prop({ required: true, enum: ['ON_DEMAND', 'ON_EVENT'], default: 'ON_DEMAND' })
  triggerType: 'ON_DEMAND' | 'ON_EVENT';

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
