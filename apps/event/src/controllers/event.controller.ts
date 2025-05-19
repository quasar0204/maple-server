import { Body, Controller, Get, Param, Post, Put, Delete, Patch, Query } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RewardService } from '../services/reward.service';
import { ResponseEventDto } from '../dto/response-event.dto';

@ApiTags('Event')
@ApiBearerAuth('access-token')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly rewardService: RewardService,
  ) {}

  @Post()
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, type: ResponseEventDto })
  async createEvent(@Body() dto: CreateEventDto): Promise<ResponseEventDto> {
    const created = await this.eventService.create(dto);
    return {
      ...created.toObject(),
      rewards: [],
    };
  }

  @Get()
  @ApiOperation({ summary: '이벤트 전체 조회' })
  @ApiResponse({ status: 200, type: [ResponseEventDto] })
  async getAllEvents(): Promise<ResponseEventDto[]> {
    const events = await this.eventService.findAll();
    return Promise.all(
      events.map(async (event) => {
        const rewards = await this.rewardService.findByEvent(event._id.toString());
        return {
          ...event.toObject(),
          rewards: rewards.flatMap((r) => r.rewards),
        };
      })
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '이벤트 상세 조회 (보상 포함)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ResponseEventDto })
  async getEventById(@Param('id') id: string): Promise<ResponseEventDto> {
    const event = await this.eventService.findById(id);
    const rewards = await this.rewardService.findByEvent(id);
    return {
      ...event.toObject(),
      rewards: rewards.flatMap((r) => r.rewards),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '이벤트 수정' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, type: ResponseEventDto })
  async updateEvent(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<ResponseEventDto> {
    const updated = await this.eventService.update(id, dto);
    return {
      ...updated.toObject(),
      rewards: [],
    };
  }

  @Patch(':id/active')
  @ApiOperation({ summary: '이벤트 활성화 상태 토글' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ResponseEventDto })
  async toggleEventActive(@Param('id') id: string): Promise<ResponseEventDto> {
    const toggled = await this.eventService.toggleActive(id);
    return {
      ...toggled.toObject(),
      rewards: [],
    };
  }
}
