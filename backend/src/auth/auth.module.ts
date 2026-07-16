import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';


@Module({

imports:[

  UsersModule,

  PassportModule,

  JwtModule.registerAsync({
    global: true,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET') ?? 'development-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  }),

],


controllers:[
  AuthController
],


providers:[
  AuthService,JwtStrategy
],


exports:[
  AuthService
]

})
export class AuthModule {}