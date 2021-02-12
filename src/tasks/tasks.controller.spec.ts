import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ITask } from './dto/task.interface';
import { TaskDoc } from './dto/task-doc.interface';

const mockUser: ITask = {
  userId: 'some user id',
  name: 'some name',
};

describe('Tasks Controller', () => {
  let tasksController: TasksController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              { userId: 'some user id', name: 'some name' },
              { userId: 'some second user id', name: 'some second name' },
              { userId: 'some third user id', name: 'some third name' },
            ]),
            getOneById: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                userId: 'Some user id',
                _id: id,
                name: 'some name',
              })
            ),
            getOneByName: jest
              .fn()
              .mockImplementation((name: string) =>
                Promise.resolve({ name, userId: 'some user id' })
              ),
            create: jest
              .fn()
              .mockImplementation((task: TaskDoc) =>
                Promise.resolve({ _id: 'a uuid', ...task })
              ),
            update: jest
              .fn()
              .mockImplementation((task: TaskDoc) =>
                Promise.resolve({ _id: 'a uuid', ...task })
              ),
            delete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    tasksController = app.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(tasksController).toBeDefined();
  });
});
