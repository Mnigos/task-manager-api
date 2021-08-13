import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users/users.service'
import { JwtStrategy } from './jwt.strategy'

const mockUser = {
  _id: 'some id',
  name: 'some user nickname',
  email: 'email@email.com',
  pass: 'user password',
}

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy

  beforeEach(async () => {
    const localModule: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {
            getOneByName: jest.fn().mockImplementation((name: string) => {
              if (name === mockUser.name) return Promise.resolve(mockUser)
              throw new BadRequestException('Cannot find user with specify name')
            }),
          },
        },
      ],
    }).compile()

    jwtStrategy = localModule.get<JwtStrategy>(JwtStrategy)
  })

  it('Should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('Should validate user', () => {
    expect(jwtStrategy.validate({ name: mockUser.name })).resolves.toEqual(mockUser)
  })

  it('Should validate a user with error', () => {
    expect(jwtStrategy.validate({ name: 'ee' })).rejects.toThrow(
      'Cannot find user with specify name'
    )
  })
})
