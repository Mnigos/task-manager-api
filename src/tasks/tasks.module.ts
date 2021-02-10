import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './models/task.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tasks', schema: TaskSchema }])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
