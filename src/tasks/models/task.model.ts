import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
  name: string;
  createdAt: Date;
}

export const TaskSchema = new Schema({
  name: { type: String, required: true },
  createdAt: {
    type: String,
    default: () => new Date(),
  },
});

const Task = model<ITask>('Task', TaskSchema);

export default Task;
