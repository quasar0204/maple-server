import {
  Controller,
  Post,
  Body,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/public.decorator';

@Controller('auth')
export class AuthProxyController {
  private readonly authServiceUrl: string;

  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('AUTH_SERVICE_URL');
    if (!url) {
      throw new Error('AUTH_SERVICE_URL is not defined');
    }
    this.authServiceUrl = url;
  }

  private async safeForward(
    ...args: Parameters<ProxyService['forward']>
  ): Promise<any> {
    try {
      return await this.proxyService.forward(...args);
    } catch (error: any) {
      if (error.response?.status && error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      }
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: any) {
    const url = `${this.authServiceUrl}/auth/signup`;
    return this.safeForward(url, 'POST', body);
  }

  @Public()
  @Post('login')
  async login(@Body() body: any) {
    const url = `${this.authServiceUrl}/auth/login`;
    return this.safeForward(url, 'POST', body);
  }
}
