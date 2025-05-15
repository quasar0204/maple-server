import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { RewardService } from './services/reward.service';
import { ClaimService } from './services/claim.service';

import { Event as EventEntity, EventSchema } from './schemas/event.schema';
import { Reward as RewardEntity, RewardSchema } from './schemas/reward.schema';
import { Claim as ClaimEntity, ClaimSchema } from './schemas/claim.schema';

import { ConditionEvaluator } from './utils/condition-evaluator';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRoot(process.env.EVENT_MONGO_URI),
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
      { name: RewardEntity.name, schema: RewardSchema },
      { name: ClaimEntity.name, schema: ClaimSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    RewardService,
    ClaimService,
    ConditionEvaluator,
    UserService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class EventModule {}
