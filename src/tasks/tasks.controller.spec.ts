import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ITask } from './dto/task.interface';
import { TaskDoc } from './dto/task-doc.interface';
import { CreateTaskDto } from './dto/create-task.dto';

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

  it('Should be defined', () => {
    expect(tasksController).toBeDefined();
  });

  it('Should return all tasks', () => {
    expect(tasksController.getAll()).resolves.toEqual([
      { userId: 'some user id', name: 'some name' },
      { userId: 'some second user id', name: 'some second name' },
      { userId: 'some third user id', name: 'some third name' },
    ]);
  });

  it('Should return one task by id', () => {
    expect(tasksController.getById('some id')).resolves.toEqual([
      { _id: 'some id', userId: 'some user id', name: 'some name' },
    ]);

    expect(tasksController.getById('some other id')).resolves.toEqual([
      { _id: 'some other id', userId: 'some user id', name: 'some name' },
    ]);
  });

  it('Should return one task by name', () => {
    expect(tasksController.getById('some name')).resolves.toEqual([
      { _id: 'some id', userId: 'some user id', name: 'some name' },
    ]);

    expect(tasksController.getById('some other name')).resolves.toEqual([
      { _id: 'some id', userId: 'some user id', name: 'some other name' },
    ]);
  });

  it('Should create new task', () => {
    const newTask: CreateTaskDto = {
      userId: 'some user id',
      name: 'some name',
    };

    expect(tasksController.create(newTask)).resolves.toEqual({
      _id: 'a uuid',
      ...newTask,
    });
  });

  it('Should update an existing task', () => {
    const newTask: CreateTaskDto = {
      userId: 'some user id',
      name: 'some name',
    };

    expect(tasksController.create(newTask)).resolves.toEqual({
      _id: 'a uuid',
      ...newTask,
    });
  });
});
