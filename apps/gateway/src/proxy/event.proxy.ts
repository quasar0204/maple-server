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
import { ConfigService } from '@nestjs/config';

@Controller()
export class EventProxyController {
  private eventUrl: string;

  constructor(
    private readonly proxy: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.eventUrl = this.configService.get<string>('EVENT_SERVICE_URL')!;
  }

  @Post('events')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  claimReward(@Body() body: any, @Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/claims`, 'POST', body, {
      Authorization: req.headers['authorization'],
    });
  }

  @Get('claims/user/:userId')
  @UseGuards(JwtAuthGuard)
  getUserClaims(@Param('userId') userId: string, @Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/claims/user/${userId}`, 'GET', null, {
      Authorization: req.headers['authorization'],
    });
  }

  @Get('claims')
  @UseGuards(JwtAuthGuard)
  getAllClaims(@Req() req: any) {
    return this.proxy.forward(`${this.eventUrl}/claims`, 'GET', null, {
      Authorization: req.headers['authorization'],
    });
  }
}
