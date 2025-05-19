import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ConfigService } from '@nestjs/config';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventProxyController {
  private readonly eventUrl: string;

  constructor(
    private readonly proxy: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.eventUrl = this.configService.get<string>('EVENT_SERVICE_URL')!;
  }

  private async safeForward(
    ...args: Parameters<ProxyService['forward']>
  ): Promise<any> {
    try {
      return await this.proxy.forward(...args);
    } catch (error: any) {
      if (error.response?.status && error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      }
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  @Post('events')
  @Roles('OPERATOR', 'ADMIN')
  createEvent(@Body() body: any, @Req() req: Request) {
    return this.safeForward(`${this.eventUrl}/events`, 'POST', body, {
      Authorization: req.headers['authorization'],
    });
  }

  @Get('events')
  getAllEvents() {
    return this.safeForward(`${this.eventUrl}/events`, 'GET');
  }

  @Get('events/:id')
  getEventById(@Param('id') id: string) {
    return this.safeForward(`${this.eventUrl}/events/${id}`, 'GET');
  }

  @Put('events/:id')
  @Roles('OPERATOR', 'ADMIN')
  updateEvent(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.safeForward(`${this.eventUrl}/events/${id}`, 'PUT', body, {
      Authorization: req.headers['authorization'],
    });
  }

  @Patch('events/:id/active')
  @Roles('OPERATOR', 'ADMIN')
  toggleEventActive(@Param('id') id: string, @Req() req: Request) {
    return this.safeForward(
      `${this.eventUrl}/events/${id}/active`,
      'PATCH',
      null,
      {
        Authorization: req.headers['authorization'],
      },
    );
  }

  @Post('events/:eventId/rewards')
  @Roles('OPERATOR', 'ADMIN')
  createReward(
    @Param('eventId') eventId: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    return this.safeForward(
      `${this.eventUrl}/events/${eventId}/rewards`,
      'POST',
      body,
      {
        Authorization: req.headers['authorization'],
      },
    );
  }

  @Put('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  updateReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    return this.safeForward(
      `${this.eventUrl}/events/${eventId}/rewards/${rewardId}`,
      'PUT',
      body,
      {
        Authorization: req.headers['authorization'],
      },
    );
  }

  @Delete('events/:eventId/rewards/:rewardId')
  @Roles('OPERATOR', 'ADMIN')
  deleteReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
    @Req() req: Request,
  ) {
    return this.safeForward(
      `${this.eventUrl}/events/${eventId}/rewards/${rewardId}`,
      'DELETE',
      null,
      {
        Authorization: req.headers['authorization'],
      },
    );
  }

  @Post('events/:eventId/claims')
  @Roles('USER')
  claimReward(
    @Param('eventId') eventId: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    return this.safeForward(
      `${this.eventUrl}/events/${eventId}/claims`,
      'POST',
      body,
      {
        Authorization: req.headers['authorization'],
      },
    );
  }

  @Patch('events/:eventId/claims/:claimId/status')
  @Roles('ADMIN')
  updateClaimStatus(
    @Param('eventId') eventId: string,
    @Param('claimId') claimId: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    return this.safeForward(
      `${this.eventUrl}/events/${eventId}/claims/${claimId}/status`,
      'PATCH',
      body,
      {
        Authorization: req.headers['authorization'],
      },
    );
  }

  @Get('claims/user/:userId')
  @Roles('USER', 'AUDITOR', 'ADMIN')
  getUserClaims(@Param('userId') userId: string, @Req() req: Request) {
    return this.safeForward(
      `${this.eventUrl}/claims/user/${userId}`,
      'GET',
      null,
      {
        Authorization: req.headers['authorization'],
      },
    );
  }

  @Get('claims')
  @Roles('AUDITOR', 'ADMIN')
  getAllClaims(@Req() req: Request) {
    return this.safeForward(`${this.eventUrl}/claims`, 'GET', null, {
      Authorization: req.headers['authorization'],
    });
  }
}
