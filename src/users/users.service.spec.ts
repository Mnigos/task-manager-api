import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { IUser } from './dto/user.interface';
import { createMock } from '@golevelup/nestjs-testing';
import { Model, Query } from 'mongoose';
import { UserDoc } from './dto/user-doc.interface';
import { Provider } from '@nestjs/common';

const mockUser: (id?: string, name?: string, pass?: string) => IUser = (
  id = 'a uuid',
  name = 'some name',
  pass = 'some pass'
) => {
  return {
    id,
    name,
    pass,
  };
};

const mockUserDoc: (mock?: {
  name?: string;
  pass?: string;
}) => Partial<UserDoc> = (mock?: { name: string; pass: string }) => {
  return {
    name: mock?.name || 'some name',
    pass: mock?.pass || 'some pass',
  };
};

const mockUserArray: IUser[] = [
  mockUser(),
  mockUser('a uuid', 'some other name', 'some other pass'),
  mockUser('a uuid', 'name', 'pass'),
];

const mockUserDocArray = [
  mockUserDoc(),
  mockUserDoc({
    name: 'some other name',
    pass: 'some other pass',
  }),
  mockUserDoc({ name: 'name', pass: 'pass' }),
];

describe('Users Service', () => {
  let usersService: UsersService;
  let usersModel: Model<UserDoc>;

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
    }).compile();

    usersService = usersModule.get<UsersService>(UsersService);
    usersModel = usersModule.get<Model<UserDoc>>(getModelToken('Users'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('Should return all users', async () => {
    jest.spyOn(usersModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUserDocArray),
    } as any);
  });
});
