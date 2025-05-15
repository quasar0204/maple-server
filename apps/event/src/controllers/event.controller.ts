import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { RewardService } from '../services/reward.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { ClaimRewardDto } from '../dto/claim-reward.dto';
import { ConditionEvaluator } from '../utils/condition-evaluator';
import { ClaimService } from '../services/claim.service';
import { UserService } from '../services/user.service';

@Controller()
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly rewardService: RewardService,
    private readonly claimService: ClaimService,
    private readonly userService: UserService,
    private readonly conditionEvaluator: ConditionEvaluator,
  ) {}

  @Post('events')
  createEvent(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Get('events')
  getAllEvents() {
    return this.eventService.findAll();
  }

  @Get('events/:id')
  getEventById(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Post('rewards')
  createReward(@Body() dto: CreateRewardDto) {
    return this.rewardService.create(dto);
  }

  @Get('rewards')
  getRewardsByEvent(@Query('eventId') eventId: string) {
    return this.rewardService.findByEvent(eventId);
  }

  @Post('claims')
  async claimReward(@Body() dto: ClaimRewardDto) {
    const alreadyClaimed = await this.claimService.hasClaimed(dto.userId, dto.eventId);
    if (alreadyClaimed) {
      return this.claimService.createWithResult(dto, false, '이미 보상을 수령했습니다');
    }

    const user = await this.userService.getUserInfo(dto.userId);
    const event = await this.eventService.findById(dto.eventId);
    const success = this.conditionEvaluator.evaluate(event.conditions, user);
    const reason = success ? '조건 충족' : '조건 불충족';

    return this.claimService.createWithResult(dto, success, reason);
  }

  @Get('claims/user/:userId')
  getClaimsByUser(@Param('userId') userId: string) {
    return this.claimService.findByUser(userId);
  }

  @Get('claims')
  getAllClaims() {
    return this.claimService.findAll();
  }
}
