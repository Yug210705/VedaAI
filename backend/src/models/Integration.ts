import mongoose, { Schema, Document } from 'mongoose';

export interface IIntegration extends Document {
  name: string;
  desc: string;
  icon: string;
  connected: boolean;
}

const IntegrationSchema: Schema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, required: true },
  connected: { type: Boolean, default: false }
});

export default mongoose.model<IIntegration>('Integration', IntegrationSchema);
