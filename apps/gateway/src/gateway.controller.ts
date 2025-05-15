import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from './auth/roles.decorator';

// FIXME : gateway에 걸맞게 api path 수정
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

  // TODO : auth 쪽 sign, login 호출하는 api 추가
  // TODO : event 쪽 호출하는 api 추가
}
