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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Event API')
@ApiBearerAuth('access-token')
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
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: '이벤트가 성공적으로 생성됨' })
  createEvent(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Get('events')
  @ApiOperation({ summary: '이벤트 전체 조회' })
  @ApiResponse({ status: 200, description: '이벤트 리스트 반환' })
  getAllEvents() {
    return this.eventService.findAll();
  }

  @Get('events/:id')
  @ApiOperation({ summary: '이벤트 상세 조회 (보상 포함)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: '이벤트 상세 및 보상 목록 포함',
    schema: {
      example: {
        _id: '665001f8f3a8a9b9f5cdab12',
        title: '출석 보상 이벤트',
        description: '3일간 로그인하면 보상 지급',
        startDate: '2025-06-01T00:00:00Z',
        endDate: '2025-06-10T00:00:00Z',
        rewards: [
          { type: 'item', value: 'itemA', quantity: 1 },
          { type: 'coupon', value: 'WELCOME2025', quantity: 1 },
        ],
      },
    },
  })
  async getEventById(@Param('id') id: string) {
    const event = await this.eventService.findById(id);
    const rewards = await this.rewardService.findByEvent(id);
    return {
      ...event.toObject(),
      rewards,
    };
  }

  @Post('events/:eventId/rewards')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 등록' })
  @ApiParam({ name: 'eventId', type: String })
  @ApiBody({ type: CreateRewardDto })
  @ApiResponse({ status: 201, description: '보상이 성공적으로 등록됨' })
  createReward(
    @Param('eventId') eventId: string,
    @Body() dto: Omit<CreateRewardDto, 'eventId'>,
  ) {
    return this.rewardService.create({ ...dto, eventId });
  }

  @Put('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 수정' })
  @ApiParam({ name: 'eventId', type: String })
  @ApiParam({ name: 'rewardId', type: String })
  @ApiBody({ type: UpdateRewardDto })
  @ApiResponse({ status: 200, description: '보상 수정 완료' })
  updateReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
    @Body() dto: UpdateRewardDto,
  ) {
    return this.rewardService.update(eventId, rewardId, dto);
  }

  @Delete('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 삭제' })
  @ApiParam({ name: 'eventId', type: String })
  @ApiParam({ name: 'rewardId', type: String })
  @ApiResponse({ status: 200, description: '보상 삭제 완료' })
  deleteReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
  ) {
    return this.rewardService.delete(eventId, rewardId);
  }

  @Post('events/:eventId/claims')
  @Roles('USER')
  @ApiOperation({ summary: '유저 보상 요청' })
  @ApiParam({ name: 'eventId', type: String })
  @ApiBody({ type: ClaimRewardDto })
  @ApiResponse({ status: 201, description: '보상 요청 처리 결과 반환' })
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

  @Get('claims/user/:userId')
  @Roles('USER', 'AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '특정 유저의 보상 이력 조회' })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, description: '유저 보상 이력 반환' })
  getClaimsByUser(@Param('userId') userId: string) {
    return this.claimService.findByUser(userId);
  }

  @Get('claims')
  @Roles('AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '전체 보상 이력 조회' })
  @ApiResponse({ status: 200, description: '전체 유저의 보상 이력 리스트 반환' })
  getAllClaims() {
    return this.claimService.findAll();
  }
}
