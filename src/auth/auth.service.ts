import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { User } from 'src/users/interfaces/user.interface'
import { UserToReturn } from './interfaces/userToReturn.interface'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(user: User): Promise<UserToReturn | null> {
    const { name } = user
    const foundedUser = await this.usersService.getOneByName(name)

    if (!foundedUser || !bcrypt.compare(user.pass, foundedUser.pass)) return null

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pass, ...userWithoutPass } = foundedUser

    return userWithoutPass
  }
}
