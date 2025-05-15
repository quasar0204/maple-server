import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { RewardService } from '../services/reward.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { ClaimRewardDto } from '../dto/claim-reward.dto';
import { ConditionEvaluator } from '../utils/condition-evaluator';
import { ClaimService } from '../services/claim.service';
import { UserService } from '../services/user.service';
import { Roles } from '../auth/roles.decorator';

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

  // 모든 역할: 이벤트 상세 조회
  @Get('events/:id')
  getEventById(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  // OPERATOR or ADMIN: 보상 등록
  @Post('rewards')
  @Roles('OPERATOR', 'ADMIN')
  createReward(@Body() dto: CreateRewardDto) {
    return this.rewardService.create(dto);
  }

  // 모든 역할: 이벤트별 보상 조회
  @Get('rewards')
  getRewardsByEvent(@Query('eventId') eventId: string) {
    return this.rewardService.findByEvent(eventId);
  }

  // USER or ADMIN: 보상 요청
  @Post('claims')
  @Roles('USER', 'ADMIN')
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

  // USER or ADMIN: 본인 이력 조회
  @Get('claims/user/:userId')
  @Roles('USER', 'ADMIN')
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
