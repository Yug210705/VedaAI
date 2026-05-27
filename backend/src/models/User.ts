import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  displayName: string;
  email: string;
  avatarUrl: string;
  role: string;
  timezone: string;
  status: string;
}

const UserSchema: Schema = new Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default' },
  role: { type: String, default: 'Teacher' },
  timezone: { type: String, default: 'Asia/Kolkata (IST)' },
  status: { type: String, default: 'Active' }
});

export default mongoose.model<IUser>('User', UserSchema);
