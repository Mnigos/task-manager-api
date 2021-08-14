import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TaskDoc } from './interfaces/taskDoc.interface'
import { Task } from './interfaces/task.interface'

@Injectable()
export class TasksService {
  constructor(@InjectModel('Tasks') private readonly TaskModel: Model<TaskDoc>) {}

  async getAll(): Promise<Task[]> {
    const tasks = await this.TaskModel.find().exec()
    return tasks
  }

  async getOneById(_id: string): Promise<Task | HttpStatus> {
    const task = await this.TaskModel.findOne({ _id }).exec()

    if (!task) return HttpStatus.BAD_REQUEST

    return task
  }

  async getOneByName(name: string): Promise<Task | HttpStatus> {
    const task = await this.TaskModel.findOne({ name }).exec()

    if (!task) return HttpStatus.BAD_REQUEST

    return task
  }

  async create(task: Task): Promise<Task> {
    const newTask = await this.TaskModel.create(task as Task)
    return newTask
  }

  async update(task: Task): Promise<Task | HttpStatus> {
    const { _id } = task

    if (!_id) return HttpStatus.BAD_REQUEST

    this.TaskModel.update({ _id }, task)
    const foundTask = await this.TaskModel.findById(_id).exec()

    return foundTask
  }

  async delete(_id: string): Promise<{ deleted: boolean; message?: string }> {
    if (!_id) return { deleted: false, message: 'id is empty' }

    try {
      await this.TaskModel.remove({ id })
      return { deleted: true }
    } catch (e) {
      return { deleted: false, message: e.message }
    }
  }
}
