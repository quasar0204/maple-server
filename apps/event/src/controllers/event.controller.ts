import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { EventService } from '../services/event.service';
import { RewardService } from '../services/reward.service';
import { ClaimService } from '../services/claim.service';
import { UserService } from '../services/user.service';
import { ConditionEvaluator } from '../utils/condition-evaluator';

import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { UpdateRewardDto } from '../dto/update-reward.dto';
import { ClaimRewardDto } from '../dto/claim-reward.dto';
import { UpdateClaimStatusDto } from '../dto/update-claim-status.dto';

import { ResponseEventDto } from '../dto/response-event.dto';
import { RewardResponseDto } from '../dto/response-reward.dto';
import { ClaimResponseDto } from '../dto/response-claim.dto';

import { RewardDocument } from '../schemas/reward.schema';
import { ClaimDocument } from '../schemas/claim.schema';

import { Roles } from '../auth/roles.decorator';
import { BadRequestException } from '@nestjs/common';

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

  private mapToEventResponse(event: any, rewards: any[]): ResponseEventDto {
    return {
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      triggerType: event.triggerType,
      conditions: event.conditions,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      isActive: event.isActive,
      rewards,
    };
  }

  private mapToRewardResponse(reward: RewardDocument): RewardResponseDto {
    return {
      _id: reward._id.toString(),
      eventId: reward.eventId.toString(),
      rewards: reward.rewards,
    };
  }

  private mapToClaimResponse(claim: ClaimDocument): ClaimResponseDto {
    return {
      _id: claim._id.toString(),
      userId: claim.userId,
      eventId: claim.eventId.toString(),
      status: claim.status,
      reason: claim.reason,
      rewardsGiven: claim.rewardsGiven,
      createdAt: claim.createdAt.toISOString(),
      updatedAt: claim.updatedAt.toISOString(),
    };
  }

  @Post('events')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, type: ResponseEventDto })
  async createEvent(@Body() dto: CreateEventDto): Promise<ResponseEventDto> {
    const created = await this.eventService.create(dto);
    return this.mapToEventResponse(created, []);
  }

  @Get('events')
  @ApiOperation({ summary: '이벤트 전체 조회' })
  @ApiResponse({ status: 200, type: [ResponseEventDto] })
  async getAllEvents(): Promise<ResponseEventDto[]> {
    const events = await this.eventService.findAll();
    return Promise.all(
      events.map(async (event) => {
        const rewards = await this.rewardService.findByEvent(
          event._id.toString(),
        );
        return this.mapToEventResponse(
          event,
          rewards.flatMap((r) => r.rewards.map((item) => ({ ...item }))),
        );
      }),
    );
  }

  @Get('events/:id')
  @ApiOperation({ summary: '이벤트 상세 조회 (보상 포함)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ResponseEventDto })
  async getEventById(@Param('id') id: string): Promise<ResponseEventDto> {
    const event = await this.eventService.findById(id);
    const rewards = await this.rewardService.findByEvent(id);
    return this.mapToEventResponse(
      event,
      rewards.flatMap((r) => r.rewards.map((item) => ({ ...item }))),
    );
  }

  @Put('events/:id')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 수정' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, type: ResponseEventDto })
  async updateEvent(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<ResponseEventDto> {
    const updated = await this.eventService.update(id, dto);
    return this.mapToEventResponse(updated, []);
  }

  @Patch('events/:id/active')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 활성화 상태 토글' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ResponseEventDto })
  async toggleEventActive(@Param('id') id: string): Promise<ResponseEventDto> {
    const toggled = await this.eventService.toggleActive(id);
    return this.mapToEventResponse(toggled, []);
  }
  @Post('events/:eventId/rewards')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 등록' })
  @ApiParam({ name: 'eventId', type: String })
  @ApiBody({ type: CreateRewardDto })
  @ApiResponse({ status: 201, type: RewardResponseDto })
  async createReward(
    @Param('eventId') eventId: string,
    @Body() dto: Omit<CreateRewardDto, 'eventId'>,
  ): Promise<RewardResponseDto> {
    const created = await this.rewardService.create({ ...dto, eventId });
    return this.mapToRewardResponse(created);
  }

  @Put('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 수정' })
  @ApiParam({ name: 'eventId', type: String })
  @ApiParam({ name: 'rewardId', type: String })
  @ApiBody({ type: UpdateRewardDto })
  @ApiResponse({ status: 200, type: RewardResponseDto })
  async updateReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
    @Body() dto: UpdateRewardDto,
  ): Promise<RewardResponseDto> {
    const updated = await this.rewardService.update(eventId, rewardId, dto);
    return this.mapToRewardResponse(updated);
  }

  /**
   * event의 triggerType이 AUTO인 경우 createPendingClaim와 유사한 함수를 만들고
   * 함수 내부에서 보상을 지급해주는 실제 외부 서비스를 호출 한 후 응답 결과에 따라 보상을 자동으로 지급할 수 있습니다.
   * 다만 외부 서비스가 없기 때문에 구현 자체는 생략했습니다.
   * 응답 결과가 성공이면 바로 성공했다고 처리하면 되고 실패한다면 실패한거만 따로 모아서 스케줄러를 돌리거나 DLQ 같은 방식을 사용 할 수 있습니다.
   */
  @Delete('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 삭제' })
  @ApiParam({ name: 'eventId', type: String })
  @ApiParam({ name: 'rewardId', type: String })
  @ApiResponse({ status: 200 })
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
  @ApiResponse({ status: 201, type: ClaimResponseDto })
  async claimReward(
    @Param('eventId') eventId: string,
    @Body() dto: Omit<ClaimRewardDto, 'eventId'>,
  ): Promise<ClaimResponseDto> {
    const alreadyClaimed = await this.claimService.hasClaimed(
      dto.userId,
      eventId,
    );

    if (alreadyClaimed) {
      const previous = await this.claimService.findOne(dto.userId, eventId);
      switch (previous?.status) {
        case 'SUCCESS':
          throw new BadRequestException('이미 보상을 수령한 이벤트입니다.');
        case 'PENDING':
          throw new BadRequestException('보상 요청이 처리 중입니다.');
        case 'FAILED':
          throw new BadRequestException(
            '보상 조건을 만족하지 않아 수령할 수 없습니다.',
          );
      }
    }

    const user = await this.userService.getUserInfo(dto.userId);
    const event = await this.eventService.findById(eventId);

    const now = new Date();
    if (now < new Date(event.startDate) || now > new Date(event.endDate)) {
      throw new BadRequestException('이벤트 기간이 아닙니다.');
    }

    const passed = this.conditionEvaluator.evaluate(event.conditions, user);

    if (!passed) {
      throw new BadRequestException(
        '보상 조건을 만족하지 않아 수령할 수 없습니다.',
      );
    }

    const result = await this.claimService.createPendingClaim(
      { ...dto, eventId },
      passed,
      '조건 충족',
    );

    return this.mapToClaimResponse(result);
  }

  @Patch('events/:eventId/claims/:claimId/status')
  @Roles('ADMIN')
  @ApiOperation({ summary: '보상 처리 상태 변경' })
  async updateClaimStatus(
    @Param('eventId') eventId: string,
    @Param('claimId') claimId: string,
    @Body() body: UpdateClaimStatusDto,
  ): Promise<ClaimResponseDto> {
    const claim = await this.claimService.updateStatus(
      claimId,
      body.status,
      body.reason,
    );
    return this.mapToClaimResponse(claim);
  }

  @Get('claims/user/:userId')
  @Roles('USER', 'AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '특정 유저의 보상 이력 조회' })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, type: [ClaimResponseDto] })
  async getClaimsByUser(
    @Param('userId') userId: string,
  ): Promise<ClaimResponseDto[]> {
    const claims = await this.claimService.findByUser(userId);
    return claims.map((c) => this.mapToClaimResponse(c));
  }

  @Get('claims')
  @Roles('AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '전체 보상 이력 조회' })
  @ApiResponse({ status: 200, type: [ClaimResponseDto] })
  async getAllClaims(): Promise<ClaimResponseDto[]> {
    const claims = await this.claimService.findAll();
    return claims.map((c) => this.mapToClaimResponse(c));
  }
}
