import { Controller, Get } from '@nestjs/common';

@Controller('gateway')
export class GatewayController {
  @Get('ping')
  gping() {
    return { status: 'ok' };
  }
}
