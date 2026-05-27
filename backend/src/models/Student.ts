import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  rollNumber: string;
  grade: string;
  status: string;
  createdAt: Date;
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNumber: { type: String, required: true },
  grade: { type: String, required: true },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStudent>('Student', StudentSchema);
