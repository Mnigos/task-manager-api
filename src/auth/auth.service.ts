import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/users/dto/user.interface';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
