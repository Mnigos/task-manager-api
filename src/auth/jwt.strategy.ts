import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport'
import { ExtractJwt } from 'passport-jwt'
import { UsersService } from '../users/users.service'
import { Payload } from './interfaces/payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: Payload) {
    const user = this.usersService.getOneByName(payload.name)

    if (!user) throw new UnauthorizedException()

    return user
  }
}
