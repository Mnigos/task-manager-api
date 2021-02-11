import { Schema, model } from 'mongoose';
import { UserDoc } from '../dto/user-doc.interface';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  pass: { type: String, required: true },
  createdAt: {
    type: String,
    default: () => new Date(),
  },
});

const User = model<UserDoc>('User', UserSchema);

export default User;
