import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IUser } from '../users/dto/user.interface';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(user: IUser): Promise<any> {
    const foundedUser = await this.authService.validateUser(user);

    if (!foundedUser) throw new UnauthorizedException();

    return foundedUser;
  }
}
