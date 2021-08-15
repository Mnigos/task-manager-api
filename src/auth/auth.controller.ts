import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Credentials } from './interfaces/credentials.interface'
import { LocalAuthGuard } from './localAuth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body(ValidationPipe) credentails: Credentials): Promise<any> {
    return { message: 'logged in' }
  }
}
