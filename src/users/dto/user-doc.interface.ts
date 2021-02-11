import { Document } from 'mongoose';

export interface TaskDoc extends Document {
  name: string;
  pass: string;
  createdAt?: Date;
}
