import { Test, TestingModule } from '@nestjs/testing'
import { TasksService } from './tasks.service'
import { getModelToken } from '@nestjs/mongoose'
import { Task } from './interfaces/task.interface'
import { createMock } from '@golevelup/nestjs-testing'
import { DocumentQuery, Model, UpdateWriteOpResult } from 'mongoose'
import { TaskDoc } from './interfaces/taskDoc.interface'

const mockTask = (userId = 'a user id', _id = 'a uuid', name = 'some name'): Task => ({
  userId,
  _id,
  name,
})

const mockTaskDoc = (mock?: Partial<Task>): Partial<TaskDoc> => ({
  userId: mock?.userId || 'a user id',
  id: mock?._id || 'a uuid',
  name: mock?.name || 'some name',
})

const mockTaskArray: Task[] = [
  mockTask(),
  mockTask('some other userId', 'a uuid', 'some other name'),
  mockTask('userId', 'a uuid', 'name'),
]

const mockTaskDocArray = [
  mockTaskDoc(),
  mockTaskDoc({
    userId: 'some other userId',
    name: 'some other name',
  }),
  mockTaskDoc({ userId: 'userId', name: 'name' }),
]

describe('Tasks Service', () => {
  let tasksService: TasksService
  let tasksModel: Model<TaskDoc>

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
    }).compile()

    tasksService = tasksModule.get<TasksService>(TasksService)
    tasksModel = tasksModule.get<Model<TaskDoc>>(getModelToken('Tasks'))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should be defined', () => {
    expect(tasksService).toBeDefined()
  })

  it('Should return all tasks', async () => {
    jest.spyOn(tasksModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockTaskDocArray),
    } as any)

    const tasks = await tasksService.getAll()
    expect(tasks).toEqual(mockTaskArray)
  })

  it('Should return one task by id', async () => {
    jest.spyOn(tasksModel, 'findOne').mockReturnValue(
      createMock<DocumentQuery<TaskDoc, TaskDoc>>({
        exec: jest.fn().mockResolvedValueOnce(mockTaskDoc()),
      })
    )

    const findMockTask = mockTask()
    const foundTask = await tasksService.getOneById('a uuid')
    expect(foundTask).toEqual(findMockTask)
  })

  it('Should return one task by name', async () => {
    jest.spyOn(tasksModel, 'findOne').mockReturnValue(
      createMock<DocumentQuery<TaskDoc, TaskDoc>>({
        exec: jest.fn().mockResolvedValueOnce(mockTaskDoc()),
      })
    )

    const findMockTask = mockTask()
    const foundTask = await tasksService.getOneByName('some name')
    expect(foundTask).toEqual(findMockTask)
  })

  it('Should inset a new task', async () => {
    jest.spyOn(tasksModel, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        userId: 'a user id',
        id: 'a uuid',
        name: 'some name',
      } as any)
    )

    const newTask = await tasksService.create({
      userId: 'a user id',
      name: 'some name',
    })

    expect(newTask).toEqual({
      userId: 'a user id',
      id: 'a uuid',
      name: 'some name',
    })
  })

  it.skip('Should update a task', async () => {
    jest.spyOn(tasksModel, 'update').mockReturnValue(
      createMock<DocumentQuery<UpdateWriteOpResult, TaskDoc, TaskDoc>>({
        exec: jest.fn().mockResolvedValueOnce(mockTaskDoc({ name: 'some other name' })),
      })
    )

    const updatedTask = await tasksService.update({
      userId: 'a user id',
      _id: 'a uuid',
      name: 'some other name',
    })
    expect(updatedTask).toEqual(mockTask('a user id', 'a uuid', 'some other name'))
  })

  it('should delete a cat successfully', async () => {
    jest.spyOn(tasksModel, 'remove').mockResolvedValueOnce(true as any)
    expect(await tasksService.delete('a bad id')).toEqual({ deleted: true })
  })

  it('should not delete a cat', async () => {
    jest.spyOn(tasksModel, 'remove').mockRejectedValueOnce(new Error('Bad delete'))
    expect(await tasksService.delete('a bad id')).toEqual({
      deleted: false,
      message: 'Bad delete',
    })
  })
})
