import { Controller, Param, Post } from '@nestjs/common'
import { UserToReturn } from '../auth/interfaces/userToReturn.interface'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:name')
  async getProfile(@Param('name') name: string): Promise<UserToReturn> {
    return await this.usersService.getProfile(name)
  }
}
