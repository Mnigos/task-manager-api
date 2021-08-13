import { Document } from 'mongoose'

export interface UserDoc extends Document {
  name: string
  email: string
  pass: string
  createdAt?: Date
}
