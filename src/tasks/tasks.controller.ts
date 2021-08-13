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
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwtAuth.guard'
import { CreateTaskDto } from './interfaces/createTask.interface'
import { Task } from './interfaces/task.interface'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<Task[]> {
    return this.tasksService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Task | HttpStatus> {
    return this.tasksService.getOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/name')
  async getByName(@Query('name') name: string): Promise<Task | HttpStatus> {
    return this.tasksService.getOneByName(name)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/new')
  async create(@Body() task: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(task)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async update(@Body() task: CreateTaskDto): Promise<Task | HttpStatus> {
    return this.tasksService.update(task)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async delete(@Body('id') id: string): Promise<{ deleted: boolean }> {
    return this.tasksService.delete(id)
  }
}
