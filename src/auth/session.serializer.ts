import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { User } from '../users/interfaces/user.interface'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void): void {
    done(null, user)
  }

  deserializeUser(payload: string, done: (err: Error, payload: string) => void): void {
    done(null, payload)
  }
}
