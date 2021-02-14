import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from './dto/user-doc.interface';
import { IUser } from './dto/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly UserModel: Model<UserDoc>
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.UserModel.find().exec();
    return users;
  }

  async getOneById(id: string): Promise<IUser | HttpStatus.BAD_REQUEST> {
    const user = await this.UserModel.findOne({ _id: id }).exec();

    if (!user) return HttpStatus.BAD_REQUEST;

    return user;
  }

  async getOneByName(name: string): Promise<IUser | HttpStatus.BAD_REQUEST> {
    const user = await this.UserModel.findOne({ name }).exec();

    if (!user) return HttpStatus.BAD_REQUEST;

    return user;
  }

  async create(user: IUser): Promise<boolean> {
    const { name, pass } = user;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    await this.UserModel.create({
      name,
      pass: hash,
    } as IUser);

    return true;
  }
}
