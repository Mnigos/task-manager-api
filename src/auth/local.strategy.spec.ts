import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../users/interfaces/user.interface'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'

const mockUser = {
  _id: 'some id',
  name: 'some user nickname',
  email: 'email@email.com',
  pass: 'user password',
}

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy

  beforeEach(async () => {
    const localModule: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockImplementation((user: User) => {
              if (user.name === mockUser.name)
                return Promise.resolve({
                  _id: mockUser._id,
                  name: mockUser.name,
                  email: mockUser.email,
                })
              throw new BadRequestException('Cannot find user with specify name')
            }),
          },
        },
      ],
    }).compile()

    localStrategy = localModule.get<LocalStrategy>(LocalStrategy)
  })

  it('Should be defined', () => {
    expect(localStrategy).toBeDefined()
  })

  it('Should validate user', () => {
    expect(localStrategy.validate(mockUser)).resolves.toEqual({
      _id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
    })
  })

  it('Should validate a user with error', () => {
    expect(
      localStrategy.validate({
        _id: mockUser._id,
        name: 'ee',
        pass: mockUser.pass,
        email: mockUser.email,
      })
    ).rejects.toThrow('Cannot find user with specify name')
  })
})
