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
    const existing = await this.claimModel.findOne({ userId, eventId }).exec();
    return !!existing;
  }

  async findOne(
    userId: string,
    eventId: string,
  ): Promise<ClaimDocument | null> {
    return this.claimModel.findOne({ userId, eventId }).exec();
  }

  async createPendingClaim(
    dto: ClaimRewardDto,
    status: boolean,
    reason: string,
  ): Promise<ClaimDocument> {
    const rewards = await this.rewardService.findByEvent(dto.eventId);

    const claim = new this.claimModel({
      userId: dto.userId,
      eventId: dto.eventId,
      status: 'PENDING',
      reason,
      rewardsGiven: status ? rewards.flatMap((r) => r.rewards) : [],
    });

    return claim.save();
  }

  async updateStatus(
    claimId: string,
    status: 'SUCCESS' | 'FAILED',
    reason?: string,
  ): Promise<ClaimDocument> {
    const claim = await this.claimModel.findById(claimId);
    if (!claim) {
      throw new NotFoundException('해당 보상 요청을 찾을 수 없습니다.');
    }
    claim.status = status;
    if (reason) claim.reason = reason;
    return claim.save();
  }

  async findAll(): Promise<ClaimDocument[]> {
    return this.claimModel.find().exec();
  }

  async findByUser(userId: string): Promise<ClaimDocument[]> {
    return this.claimModel.find({ userId }).exec();
  }

  async validateEventExists(eventId: string): Promise<void> {
    const event = await this.eventService.findById(eventId);
    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }
  }

  async validateUserInfo(userId: string): Promise<Record<string, any>> {
    const user = await this.userService.getUserInfo(userId);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }
    return user;
  }
}
