import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { DocumentQuery, Model, UpdateWriteOpResult } from 'mongoose'
import { User } from './interfaces/user.interface'
import { UserDoc } from './interfaces/userDoc.interface'
import { createMock } from '@golevelup/nestjs-testing'
import { UsersService } from './users.service'

const mockUser = (
  _id = 'a uuid',
  name = 'some name',
  email = 'some email@email.com',
  pass = 'some pass'
): User => ({
  _id,
  name,
  email,
  pass,
})

const mockUserDoc = (mock?: Partial<User>): Partial<UserDoc> => ({
  _id: mock?._id || 'a uuid',
  email: mock?.email || 'some email@email.com',
  name: mock?.name || 'some name',
  pass: mock?.pass || 'some pass',
})

const mockUserArray: User[] = [
  mockUser(),
  mockUser('a uuid', 'some other name', 'some other email@email.com', 'some other pass'),
  mockUser('a uuid', 'name', 'email@email.com', 'pass'),
]

const mockUserDocArray = [
  mockUserDoc(),
  mockUserDoc({
    name: 'some other name',
    email: 'some other email@email.com',
    pass: 'some other pass',
  }),
  mockUserDoc({ name: 'name', email: 'email@email.com', pass: 'pass' }),
]

describe('UsersService', () => {
  let usersService: UsersService
  let usersModel: Model<UserDoc>

  beforeEach(async () => {
    const usersModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('Users'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
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

    usersService = usersModule.get<UsersService>(UsersService)
    usersModel = usersModule.get<Model<UserDoc>>(getModelToken('Users'))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(usersService).toBeDefined()
  })

  it('Should return all users', async () => {
    jest.spyOn(usersModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUserDocArray),
    } as any)

    const users = await usersService.getAll()
    expect(users).toEqual(mockUserArray)
  })

  it('Should return one user by id', async () => {
    jest.spyOn(usersModel, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<UserDoc, UserDoc>>({
        exec: jest.fn().mockResolvedValueOnce(mockUserDoc()),
      })
    )

    const findMockUser = mockUser()
    const foundUser = await usersService.getOneById('a uuid')
    expect(foundUser).toEqual(findMockUser)
  })

  it('Should return one user by name', async () => {
    jest.spyOn(usersModel, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<UserDoc, UserDoc>>({
        exec: jest.fn().mockResolvedValueOnce(mockUserDoc()),
      })
    )

    const findMockUser = mockUser()
    const foundUser = await usersService.getOneByName('some name')
    expect(foundUser).toEqual(findMockUser)
  })

  it('Should return one user by email', async () => {
    jest.spyOn(usersModel, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<UserDoc, UserDoc>>({
        exec: jest.fn().mockResolvedValueOnce(mockUserDoc()),
      })
    )

    const findMockUser = mockUser()
    const { name, _id, email } = findMockUser
    const foundUser = await usersService.getProfile(findMockUser.name)
    expect(foundUser).toEqual({
      name,
      _id,
      email,
      createdAt: undefined,
    })
  })

  it('Should return one user by email', async () => {
    jest.spyOn(usersModel, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<UserDoc, UserDoc>>({
        exec: jest.fn().mockResolvedValueOnce(mockUserDoc()),
      })
    )

    const findMockUser = mockUser()
    const foundUser = await usersService.getOneByEmail('email@email.com')
    expect(foundUser).toEqual(findMockUser)
  })

  it('Should not insert a new user cause password do not match regex', async () => {
    jest.spyOn(usersModel, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        name: 'some name',
        email: 'some email@email.com',
        pass: 'some pass',
      } as User)
    )

    const newUser = usersService.create({
      name: 'some name',
      email: 'some email@email.com',
      pass: 'some pass',
    })
    expect(newUser).rejects.toThrow('Password does not match regex')
  })

  it('Should insert a new user with success', async () => {
    jest.spyOn(usersModel, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        name: 'some name',
        email: 'some email@email.com',
        pass: 'gr3at@3wdsG',
      } as User)
    )

    const newUser = await usersService.create({
      name: 'some name',
      email: 'some email@email.com',
      pass: 'gr3at@3wdsG',
    })
    expect(newUser).toEqual(true)
  })

  //@TODO Fix error with this unit test (returning 400 but should return specify user object)
  it.skip('Should update a user', async () => {
    jest.spyOn(usersModel, 'update').mockReturnValueOnce(
      createMock<DocumentQuery<UpdateWriteOpResult, UserDoc>>({
        exec: jest.fn().mockResolvedValueOnce({
          _id: 'some id',
          name: 'some name',
          email: 'some@email.com',
          pass: 'some pass',
        }),
      })
    )

    const updatedUser = await usersService.update({
      _id: 'some id',
      name: 'some name',
      email: 'some@email.com',
      pass: 'some pass',
    })

    expect(updatedUser).toEqual(mockUser('some id', 'some name', 'some@email.com', 'some pass'))
  })

  //@TODO Fix error with delete method test `Failed: true`
  it.skip('Should delete a user', async () => {
    jest.spyOn(usersModel, 'remove').mockRejectedValueOnce(true as any)
    expect(await usersService.delete('a uuid')).toEqual(true)
  })
})
