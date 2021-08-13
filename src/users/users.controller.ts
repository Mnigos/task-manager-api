import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { UserToReturn } from '../auth/interfaces/userToReturn.interface'
import { JwtAuthGuard } from '../auth/jwtAuth.guard'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:name')
  async getProfile(@Param('name') name: string): Promise<UserToReturn> {
    return await this.usersService.getProfile(name)
  }
}
