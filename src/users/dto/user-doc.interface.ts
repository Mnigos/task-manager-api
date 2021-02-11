import { Document } from 'mongoose';

export interface UserDoc extends Document {
  name: string;
  pass: string;
  createdAt?: Date;
}
