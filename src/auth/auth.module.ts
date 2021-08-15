import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'
import { SessionSerializer } from './session.serializer'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'abc',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [PassportModule],
})
export class AuthModule {}
