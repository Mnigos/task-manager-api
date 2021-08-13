import { Test, TestingModule } from '@nestjs/testing'
import { UserToReturn } from 'src/auth/interfaces/userToReturn.interface'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const mockUserToReturn = (
  _id = 'a uuid',
  name = 'some name',
  email = 'some email@email.com'
): UserToReturn => ({
  _id,
  name,
  email,
})

describe('UsersController', () => {
  let usersController: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getProfile: jest.fn().mockImplementation(() => Promise.resolve(mockUserToReturn())),
          },
        },
      ],
    }).compile()

    usersController = module.get<UsersController>(UsersController)
  })

  it('Should be defined', () => {
    expect(usersController).toBeDefined()
  })

  it('Should return a specify profile', () => {
    const { _id, name, email } = mockUserToReturn()

    expect(usersController.getProfile(name)).resolves.toEqual({
      _id,
      name,
      email,
    })
  })
})
