import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/interfaces/createUser.interface'
import { Credentials } from './interfaces/credentials.interface'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/users/interfaces/user.interface'
import { UserToReturn } from './interfaces/userToReturn.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(user: User): Promise<UserToReturn | null> {
    const { name } = user
    const foundedUser = await this.usersService.getOneByName(name)

    if (!foundedUser || !bcrypt.compare(user.pass, foundedUser.pass)) return null

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pass, ...userWithoutPass } = foundedUser

    return userWithoutPass
  }

  async register(user: CreateUserDto): Promise<boolean | { access_token: string }> {
    const registeredStatus = await this.usersService.create(user)

    if (!registeredStatus) return registeredStatus

    return await this.login({ nameOrEmail: user.name, pass: user.pass } as Credentials)
  }

  async login(credentials: Credentials): Promise<{ access_token: string }> {
    const { nameOrEmail, pass } = credentials
    let sub: string

    if (!nameOrEmail) throw new BadRequestException('Name or Email field cannot be empty')
    if (!pass) throw new BadRequestException('Password field cannot be empty')

    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/

    if (nameOrEmail.match(emailRegex)) sub = 'email'
    sub = 'name'

    return {
      access_token: this.jwtService.sign({ name: nameOrEmail, sub }),
    }
  }
}
