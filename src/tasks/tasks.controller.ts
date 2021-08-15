import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { CreateTaskDto } from './interfaces/createTask.interface'
import { Task } from './interfaces/task.interface'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll(): Promise<Task[]> {
    return this.tasksService.getAll()
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Task | HttpStatus> {
    return this.tasksService.getOneById(id)
  }

  @Get('/name')
  async getByName(@Query('name') name: string): Promise<Task | HttpStatus> {
    return this.tasksService.getOneByName(name)
  }

  @Post('/new')
  async create(@Body() task: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(task)
  }

  @Patch('/update')
  async update(@Body() task: CreateTaskDto): Promise<Task | HttpStatus> {
    return this.tasksService.update(task)
  }

  @Delete('/delete/:id')
  async delete(@Body('id') id: string): Promise<{ deleted: boolean }> {
    return this.tasksService.delete(id)
  }
}
