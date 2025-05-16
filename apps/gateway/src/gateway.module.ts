import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

import { AuthProxyController } from './proxy/auth.proxy';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

import { ProxyService } from './proxy/proxy.service';
import { EventProxyController } from './proxy/event.proxy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GatewayController, EventProxyController, AuthProxyController],
  providers: [
    GatewayService,
    JwtStrategy,
    ProxyService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class GatewayModule {}
