import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { ITask } from './dto/task.interface';
import { createMock } from '@golevelup/nestjs-testing';
import { DocumentQuery, Model } from 'mongoose';
import { TaskDoc } from './dto/task-doc.interface';

const mockTask: (userId?: string, id?: string, name?: string) => ITask = (
  userId = 'a user id',
  id = 'a uuid',
  name = 'some name'
) => {
  return {
    userId,
    id,
    name,
  };
};

const mockTaskDoc: (mock?: {
  userId?: string;
  id?: string;
  name?: string;
}) => Partial<TaskDoc> = (mock?: {
  userId: string;
  id: string;
  name: string;
}) => {
  return {
    userID: mock?.userId || 'some userId',
    id: mock?.id || 'a uuid',
    name: mock?.name || 'some name',
  };
};

const mockTaskArray: ITask[] = [
  mockTask(),
  mockTask('a uuid', 'some other name', 'some other userId'),
  mockTask('a uuid', 'name', 'userId'),
];

const mockTaskDocArray = [
  mockTaskDoc(),
  mockTaskDoc({
    name: 'some other name',
    userId: 'some other userId',
  }),
  mockTaskDoc({ name: 'name', userId: 'userId' }),
];

describe('Tasks Service', () => {
  let tasksService: TasksService;
  let tasksModel: Model<TaskDoc>;

  beforeEach(async () => {
    const tasksModule: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken('Tasks'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTask()),
            constructor: jest.fn().mockResolvedValue(mockTask()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksService = tasksModule.get<TasksService>(TasksService);
    tasksModel = tasksModule.get<Model<TaskDoc>>(getModelToken('Tasks'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(tasksService).toBeDefined();
  });
});
