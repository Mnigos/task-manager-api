import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from './dto/user-doc.interface';
import { IUser } from './dto/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly UserModel: Model<UserDoc>
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.UserModel.find().exec();
    return users;
  }

  async getOneById(_id: string): Promise<IUser | HttpStatus.BAD_REQUEST> {
    const user = await this.UserModel.findOne({ _id }).exec();

    if (!user) return HttpStatus.BAD_REQUEST;

    return user;
  }

  async getOneByName(name: string): Promise<IUser | HttpStatus.BAD_REQUEST> {
    const user = await this.UserModel.findOne({ name }).exec();

    if (!user) return HttpStatus.BAD_REQUEST;

    return user;
  }

  async create(user: IUser): Promise<IUser> {
    const newUser = await this.UserModel.create(user as IUser);
    return newUser;
  }
}
