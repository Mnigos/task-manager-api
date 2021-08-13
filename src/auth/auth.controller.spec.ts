import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let authController: AuthController

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockImplementation(() => Promise.resolve(true)),
          },
        },
      ],
    }).compile()

    authController = authModule.get<AuthController>(AuthController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should be defined', () => {
    expect(authController).toBeDefined()
  })

  it('Should not register a new user cause password do not match pass regex', () => {
    const newUser = {
      name: 'Some name',
      email: 'somesome.org',
      pass: '1234',
    }

    expect(authController.register(newUser)).resolves.toEqual(400)
  })

  it('Should register a new user', () => {
    const newUser = {
      name: 'Some name',
      email: 'somesome.org',
      pass: 'gr3at@3wdsG',
    }

    expect(authController.register(newUser)).resolves.toEqual(true)
  })
})
