import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { IUser } from '../users/dto/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(user: IUser): Promise<any> {
    const { name, pass } = user;
    const foundedUser = await this.usersService.getOneByName(name);
    if (
      foundedUser !== HttpStatus.BAD_REQUEST &&
      bcrypt.compare(pass, foundedUser.pass)
    ) {
      const { _id, name, createdAt } = foundedUser;

      return {
        _id,
        name,
        createdAt,
      };
    }

    return null;
  }

  async login(user: IUser): Promise<any> {
    const { name, _id } = user;

    return {
      access_token: this.jwtService.sign({ name, sub: _id }),
    };
  }

  async register(user: IUser): Promise<any> {
    return await this.usersService.create(user);
  }
}
