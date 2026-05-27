import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentName: string;
  score: number;
  maxScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  missedConcepts: string[];
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentName: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  grade: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  missedConcepts: [{ type: String }],
  submittedAt: { type: Date, default: Date.now }
});

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
