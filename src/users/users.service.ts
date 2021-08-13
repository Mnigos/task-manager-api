import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './interfaces/user.interface'
import { UserDoc } from './interfaces/userDoc.interface'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './interfaces/createUser.interface'
import { UserToReturn } from '../auth/interfaces/userToReturn.interface'

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private readonly UserModel: Model<UserDoc>) {}

  async getAll(): Promise<User[]> {
    return (await this.UserModel.find().exec()) as User[]
  }

  async getOneById(_id: string): Promise<User> {
    const user = await this.UserModel.findOne({ _id }).exec()

    if (!user) throw new BadRequestException('Cannot find user with specify id')

    return user as User
  }

  async getOneByName(name: string): Promise<User> {
    const user = await this.UserModel.findOne({ name }).exec()

    if (!user) throw new BadRequestException('Cannot find user with specify name')

    return user as User
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({ email }).exec()

    if (!user) throw new BadRequestException('Cannot find user with specify email')

    return user as User
  }

  async getProfile(name: string): Promise<UserToReturn> {
    const user = await this.UserModel.findOne({ name }).exec()

    if (!user) throw new BadRequestException('Cannot find user with specify name')

    const { _id, email, createdAt } = user

    return {
      _id,
      name,
      email,
      createdAt,
    }
  }

  async create(user: CreateUserDto): Promise<boolean> {
    const { name, email, pass } = user

    const isNameDontConflict = await this.UserModel.findOne({ name })

    if (isNameDontConflict) throw new ConflictException('Username has already been taken')

    const passRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/

    if (!pass.match(passRegex)) throw new BadRequestException('Password does not match regex')
    if (!email.match(emailRegex)) throw new BadRequestException('Email does not match regex')

    const saltRounds = 10
    const hash = await bcrypt.hash(pass, saltRounds)

    await this.UserModel.create({
      name,
      email,
      pass: hash,
    } as User)

    return true
  }

  async update(user: User): Promise<User> {
    const { _id } = user

    const updatedUser = await this.UserModel.findOne({ _id })

    if (!updatedUser) throw new BadRequestException('Cannot find user with specify id')

    await this.UserModel.updateOne({ _id }, user)

    return updatedUser as User
  }

  async delete(_id: string): Promise<boolean> {
    const deletedUser = await this.UserModel.remove({ _id })

    if (!deletedUser) throw new BadRequestException('Something went wrong with deleting this user')

    return true
  }
}
