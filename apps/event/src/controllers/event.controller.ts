import { Body, Controller, Get, Param, Post, Put, Delete, Query } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { RewardService } from '../services/reward.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { ClaimRewardDto } from '../dto/claim-reward.dto';
import { ConditionEvaluator } from '../utils/condition-evaluator';
import { ClaimService } from '../services/claim.service';
import { UserService } from '../services/user.service';
import { Roles } from '../auth/roles.decorator';
import { UpdateRewardDto } from '../dto/update-reward.dto';

@Controller()
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly rewardService: RewardService,
    private readonly claimService: ClaimService,
    private readonly userService: UserService,
    private readonly conditionEvaluator: ConditionEvaluator,
  ) {}

  // OPERATOR or ADMIN: 이벤트 생성
  @Post('events')
  @Roles('OPERATOR', 'ADMIN')
  createEvent(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  // 모든 역할: 이벤트 전체 조회
  @Get('events')
  getAllEvents() {
    return this.eventService.findAll();
  }

  // 모든 역할: 이벤트 상세 조회 (보상 포함)
  @Get('events/:id')
  async getEventById(@Param('id') id: string) {
    const event = await this.eventService.findById(id);
    const rewards = await this.rewardService.findByEvent(id);
    return {
      ...event.toObject(),
      rewards,
    };
  }

  // OPERATOR or ADMIN: 보상 등록
  @Post('events/:eventId/rewards')
  @Roles('OPERATOR', 'ADMIN')
  createReward(
    @Param('eventId') eventId: string,
    @Body() dto: Omit<CreateRewardDto, 'eventId'>,
  ) {
    return this.rewardService.create({ ...dto, eventId });
  }

  // OPERATOR or ADMIN: 보상 수정
  @Put('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  updateReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
    @Body() dto: UpdateRewardDto,
  ) {
    return this.rewardService.update(eventId, rewardId, dto);
  }

  // OPERATOR or ADMIN: 보상 삭제
  @Delete('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  deleteReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
  ) {
    return this.rewardService.delete(eventId, rewardId);
  }

  // USER : 보상 요청
  @Post('events/:eventId/claims')
  @Roles('USER')
  async claimReward(
    @Param('eventId') eventId: string,
    @Body() dto: Omit<ClaimRewardDto, 'eventId'>,
  ) {
    const alreadyClaimed = await this.claimService.hasClaimed(dto.userId, eventId);
    if (alreadyClaimed) {
      return this.claimService.createWithResult({ ...dto, eventId }, false, '이미 보상을 수령했습니다');
    }

    const user = await this.userService.getUserInfo(dto.userId);
    const event = await this.eventService.findById(eventId);
    const success = this.conditionEvaluator.evaluate(event.conditions, user);
    const reason = success ? '조건 충족' : '조건 불충족';

    return this.claimService.createWithResult({ ...dto, eventId }, success, reason);
  }

  // USER or AUDITOR or ADMIN: 본인 이력 조회
  @Get('claims/user/:userId')
  @Roles('USER', 'AUDITOR', 'ADMIN')
  getClaimsByUser(@Param('userId') userId: string) {
    return this.claimService.findByUser(userId);
  }

  // AUDITOR or ADMIN: 전체 이력 조회
  @Get('claims')
  @Roles('AUDITOR', 'ADMIN')
  getAllClaims() {
    return this.claimService.findAll();
  }
}
