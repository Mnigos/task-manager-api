import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/nestjs-testing';
import { TasksService } from './tasks.service';
import { Task } from './dto/task.inferface';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentQuery, Model } from 'mongoose';
import { ITask } from './models/task.model';

const mockTask: (id?: string, name?: string) => Task = (
  id: 'a uuid',
  name: 'Do some programming'
) => {
  return {
    id,
    name,
  };
};

const tasksArray: Task[] = [
  mockTask('a uuid', 'Do some programming'),
  mockTask('a uuid', 'Do some work'),
  mockTask(),
];

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken('Task'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTask()),
            constructor: jest.fn().mockResolvedValue(mockTask()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return all tasks', async () => {
    jest.spyOn(Model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(tasksArray),
    } as any);

    const tasks = await service.getAll();
    expect(tasks).toEqual(tasksArray);
  });

  it('Should return one task by id', async () => {
    jest.spyOn(Model, 'findOne').mockImplementationOnce(
      createMock<DocumentQuery<ITask, ITask, unknown>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(mockTask('a uuid', 'Do some work')),
      })
    );

    const foundTask = await service.getOneById('an id');
    expect(foundTask).toEqual({
      id: 'a uuid',
      name: 'Do some work',
    });
  });

  it('Should return one task by name', async () => {
    jest.spyOn(Model, 'findOne').mockImplementationOnce(
      createMock<DocumentQuery<ITask, ITask, unknown>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(mockTask('a uuid', 'Do some work')),
      })
    );

    const foundTask = await service.getOneByName('Do some work');
    expect(foundTask).toEqual({
      id: 'a uuid',
      name: 'Do some work',
    });
  });

  it('Should create new task', async () => {
    jest.spyOn(Model, 'create').mockResolvedValue({
      id: 'a uuid',
      name: 'Do some programming',
    } as any);

    const newTask = await service.create({
      _id: 'a uuid',
      name: 'Do some programming',
    });

    expect(newTask).toEqual(mockTask('a uuid', 'Do some programming'));
  });

  it('Should update an existing task', async () => {
    jest.spyOn(Model, 'update').mockResolvedValueOnce(true);
    jest.spyOn(Model, 'findOne').mockImplementationOnce(
      createMock<DocumentQuery<ITask, ITask, unknown>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(mockTask('a uuid', 'Do some work')),
      })
    );

    const newTask = await service.create({
      _id: 'a uuid',
      name: 'Do some programming',
    });

    expect(newTask).toEqual(mockTask('a uuid', 'Do some programming'));
  });

  it('Should delete a task', () => {
    jest.spyOn(Model, 'remove').mockImplementationOnce(true as any);
    expect(await service.delete('a bad id')).toEqual({ deleted: true });
  });
});
