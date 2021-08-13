import { Schema, model } from 'mongoose'
import { TaskDoc } from '../dto/task-doc.interface'

export const TaskSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: {
    type: String,
    default: () => new Date(),
  },
})

const Task = model<TaskDoc>('Task', TaskSchema)

export default Task
