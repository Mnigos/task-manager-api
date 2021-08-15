import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../users/interfaces/user.interface'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'

const mockUser = {
  _id: 'some id',
  name: 'some user nickname',
  email: 'email@email.com',
  pass: 'user password',
}

const mockCredentials = {
  nameOrEmail: 'email@email.com',
  pass: 'user password',
}

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: User) => Promise.resolve({ id: 'a uuid', ...user })),
            getOneByName: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ _id: mockUser._id, name: mockUser.name, email: mockUser.email })
              ),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation(() => 'abcdedef'),
          },
        },
      ],
    }).compile()

    authService = authModule.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('Should validate a user', () => {
    expect(authService.validateUser(mockUser)).resolves.toEqual({
      _id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
    })
  })
})
