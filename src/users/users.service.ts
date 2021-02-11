import { Injectable } from '@nestjs/common';
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
}
