import mongoose, { Schema, Document } from 'mongoose';

export interface IBilling extends Document {
  planType: string;
  price: string;
  tokensUsed: number;
  tokenLimit: number;
  resetDate: Date;
}

const BillingSchema: Schema = new Schema({
  planType: { type: String, default: 'Pro Educator' },
  price: { type: String, default: '$12 / month (billed annually)' },
  tokensUsed: { type: Number, default: 6842 },
  tokenLimit: { type: Number, default: 10000 },
  resetDate: { type: Date, default: () => new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) } // +12 days
});

export default mongoose.model<IBilling>('Billing', BillingSchema);
