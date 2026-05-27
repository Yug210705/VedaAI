import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  description: string;
  type: string;
  read: boolean;
  timestamp: Date;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['success', 'info', 'warning', 'error'], default: 'info' },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
