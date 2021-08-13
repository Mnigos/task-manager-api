import { Document } from 'mongoose'

export interface TaskDoc extends Document {
  userId: string
  name: string
  createdAt?: Date
}
