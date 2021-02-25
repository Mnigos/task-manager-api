import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { IUser } from './users/dto/user.interface';

const mockUser: IUser = {
  name: 'some user nickname',
  pass: 'user password',
};

describe('App Controller', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest
              .fn()
              .mockImplementation((user: IUser) =>
                Promise.resolve({ id: 'a uuid', ...user })
              ),
            login: jest.fn().mockResolvedValue({ access_token: 'some token' }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('Should register user', () => {
    expect(appController.register(mockUser)).resolves.toEqual({
      id: 'a uuid',
      ...mockUser,
    });
  });

  it('Should login user and return token', () => {
    expect(appController.login(mockUser)).resolves.toEqual({
      access_token: 'some token',
    });
  });
});
