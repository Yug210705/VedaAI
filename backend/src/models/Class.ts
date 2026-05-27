import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  subject: string;
  studentsCount: number;
  avgScore: string;
  activeTasks: number;
  color: string;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

const ClassSchema: Schema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  studentsCount: { type: Number, default: 0 },
  avgScore: { type: String, default: '0%' },
  activeTasks: { type: Number, default: 0 },
  color: { type: String, default: 'bg-blue-500' },
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IClass>('Class', ClassSchema);
