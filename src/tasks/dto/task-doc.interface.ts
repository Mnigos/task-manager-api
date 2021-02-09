import { Document } from 'mongoose';

export interface TaskDoc extends Document {
  name: string;
  createdAt?: Date;
}
