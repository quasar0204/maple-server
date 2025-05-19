import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ConfigService } from '@nestjs/config';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventProxyController {
  private eventUrl: string;

  constructor(
    private readonly proxy: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.eventUrl = this.configService.get<string>('EVENT_SERVICE_URL')!;
  }

  @Post('events')
  @Roles('OPERATOR', 'ADMIN')
  createEvent(@Body() body: any, @Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/events`, 'POST', body, {
      Authorization: req.headers['authorization'],
    });
  }

  @Get('events')
  getEvents() {
    return this.proxy.forward(`${this.eventUrl}/events`, 'GET');
  }

  @Get('events/:id')
  getEventById(@Param('id') id: string) {
    return this.proxy.forward(`${this.eventUrl}/events/${id}`, 'GET');
  }

  @Post('rewards')
  @Roles('OPERATOR', 'ADMIN')
  createReward(@Body() body: any, @Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/rewards`, 'POST', body, {
      Authorization: req.headers['authorization'],
    });
  }

  @Get('rewards')
  getRewardsByEvent(@Query('eventId') eventId: string) {
    return this.proxy.forward(`${this.eventUrl}/rewards?eventId=${eventId}`, 'GET');
  }

  @Post('claims')
  @Roles('USER', 'ADMIN')
  claimReward(@Body() body: any, @Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/claims`, 'POST', body, {
      Authorization: req.headers['authorization'],
    });
  }

  @Get('claims/user/:userId')
  @Roles('USER', 'ADMIN')
  getUserClaims(@Param('userId') userId: string, @Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/claims/user/${userId}`, 'GET', null, {
      Authorization: req.headers['authorization'],
    });
  }

  @Get('claims')
  @Roles('AUDITOR', 'ADMIN')
  getAllClaims(@Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/claims`, 'GET', null, {
      Authorization: req.headers['authorization'],
    });
  }
}
