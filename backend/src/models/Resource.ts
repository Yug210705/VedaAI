import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  name: string;
  type: string;
  size: string;
  date: Date;
  starred: boolean;
  folder: string;
}

const ResourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'pdf', 'doc', 'img', 'sheet'
  size: { type: String, required: true },
  date: { type: Date, default: Date.now },
  starred: { type: Boolean, default: false },
  folder: { type: String, default: 'Uncategorized' }
});

export default mongoose.model<IResource>('Resource', ResourceSchema);
