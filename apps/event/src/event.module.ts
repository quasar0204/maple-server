import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { RewardService } from './services/reward.service';
import { ClaimService } from './services/claim.service';

import { Event as EventEntity, EventSchema } from './schemas/event.schema';
import { Reward as RewardEntity, RewardSchema } from './schemas/reward.schema';
import { Claim as ClaimEntity, ClaimSchema } from './schemas/claim.schema';

import { ConditionEvaluator } from './utils/condition-evaluator';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.EVENT_MONGO_URI),
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
      { name: RewardEntity.name, schema: RewardSchema },
      { name: ClaimEntity.name, schema: ClaimSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, RewardService, ClaimService, ConditionEvaluator, UserService],
})
export class EventModule {}
