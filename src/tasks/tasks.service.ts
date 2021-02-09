import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskDoc } from './dto/task-doc.interface';
import { Task } from './dto/task.interface';

@Injectable()
export class TasksService {
  private readonly Tasks: Task[] = [];

  constructor(
    @InjectModel('Task') private readonly TaskModel: Model<TaskDoc>
  ) {}

  async getAll(): Promise<Task[]> {
    const tasks = await this.TaskModel.find().exec();
    return tasks;
  }

  async getOneById(_id: string) {
    const task = await this.TaskModel.findOne({ _id }).exec();

    if (!task) return HttpStatus.BAD_REQUEST;

    return task;
  }

  async getOneByName(name: string) {
    const task = await this.TaskModel.findOne({ name }).exec();

    if (!task) return HttpStatus.BAD_REQUEST;

    return task;
  }

  async create(task: Task): Promise<Task> {
    const newTask = await this.TaskModel.create(task as Task);
    return newTask;
  }

  async update(task: Task) {
    const { _id } = task;

    if (!_id) return HttpStatus.BAD_REQUEST;

    this.TaskModel.update({ _id }, task);
    const foundTask = await this.TaskModel.findOne({ _id }).exec();

    return foundTask;
  }

  async delete(id: string): Promise<{ deleted: boolean; message?: string }> {
    if (!id) return { deleted: false, message: 'id is empty' };

    try {
      await this.TaskModel.remove({ id });
      return { deleted: true };
    } catch (e) {
      return { deleted: false, message: e.message };
    }
  }
}
