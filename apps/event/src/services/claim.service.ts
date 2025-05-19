import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Claim, ClaimDocument } from '../schemas/claim.schema';
import { ClaimRewardDto } from '../dto/claim-reward.dto';
import { EventService } from './event.service';
import { RewardService } from './reward.service';
import { ConditionEvaluator } from '../utils/condition-evaluator';
import { UserService } from './user.service';

@Injectable()
export class ClaimService {
  constructor(
    @InjectModel(Claim.name)
    private claimModel: Model<ClaimDocument>,
    private readonly eventService: EventService,
    private readonly rewardService: RewardService,
    private readonly conditionEvaluator: ConditionEvaluator,
    private readonly userService: UserService,
  ) {}

  async hasClaimed(userId: string, eventId: string): Promise<boolean> {
    const existing = await this.claimModel.findOne({ userId, eventId });
    return !!existing;
  }

  async createWithResult(
    dto: ClaimRewardDto,
    status: boolean,
    reason: string,
  ): Promise<Claim> {
    const rewards = await this.rewardService.findByEvent(dto.eventId);

    const claim = new this.claimModel({
      userId: dto.userId,
      eventId: dto.eventId,
      status: status ? 'SUCCESS' : 'FAILED',
      reason,
      rewardsGiven: status ? rewards.flatMap((r) => r.rewards) : [],
    });

    return claim.save();
  }

  async findAll(): Promise<Claim[]> {
    return this.claimModel.find();
  }

  async findByUser(userId: string): Promise<Claim[]> {
    return this.claimModel.find({ userId });
  }
}
