import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { io, Socket } from 'socket.io-client'
import { AppModule } from './../src/app.module'
import { Room } from '../src/room/interfaces/room.interface'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let clientSocket: Socket

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    clientSocket = io(`http://localhost:${process.env.port || 3000}`)

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(() => {
    clientSocket.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })

  it("WebSockets: 'getRoom'", () => {
    clientSocket.emit('joinRoom', 'mnig')
    clientSocket.on('sendRoom', (room: Room) => {
      expect(room.users).toBe(['mnig'])
    })
  })

  it("WebSockets: 'leaveRoom'", () => {
    let roomToSend: Room

    clientSocket.emit('joinRoom', 'mnig')
    clientSocket.on('sendRoom', (room: Room) => {
      roomToSend = room
    })

    clientSocket.emit('leaveRoom', roomToSend)
    clientSocket.on('leaveRoomConfirmation', (confirmation: boolean) => {
      expect(confirmation).toBe(true)
    })
  })

  it("WebSockets: 'message'", () => {
    clientSocket.emit('message', 'hello world')
    clientSocket.on('message', (message: string) => {
      expect(message).toBe('hello world')
    })
  })
})
