import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from './auth/roles.decorator';

@Controller('test')
export class GatewayController {
  @Get('protected')
  @Roles('USER', 'ADMIN')
  getProtected(@Req() req: Request) {
    return {
      message: 'You are authenticated',
      user: req.user,
    };
  }
}
