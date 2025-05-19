import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type UserRole = 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'],
    default: 'USER',
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
