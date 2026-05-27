import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  location: string;
  academicYear: string;
}

const OrganizationSchema: Schema = new Schema({
  name: { type: String, default: 'Delhi Public School' },
  location: { type: String, default: 'Bokaro Steel City' },
  academicYear: { type: String, default: '2023 - 2024' }
});

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
