import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { User } from '../users/interfaces/user.interface'
import { AuthService } from './auth.service'
import { UserToReturn } from './interfaces/userToReturn.interface'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super()
  }

  async validate(user: User): Promise<UserToReturn | boolean> {
    const foundedUser = await this.authService.validateUser(user)

    if (!foundedUser) throw new UnauthorizedException()

    return foundedUser
  }
}
