import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface ISamplePaper {
  id: string;
  isSelected: boolean;
  sections: ISection[];
}

export interface IAssignment extends Document {
  title: string;
  studentClass?: string;
  dueDate: Date;
  questionTypes: {
    type: string;
    count: number;
    marks: number;
  }[];
  totalQuestions: number;
  totalMarks: number;
  additionalInfo?: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  samplePapers: ISamplePaper[];
  generatedQuestions?: any[];
  submittedCount: number;
  totalCount: number;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true },
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const SamplePaperSchema = new Schema<ISamplePaper>({
  id: { type: String, required: true },
  isSelected: { type: Boolean, default: false },
  sections: [SectionSchema],
});

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  studentClass: { type: String },
  dueDate: { type: Date, required: true },
  questionTypes: [
    {
      type: { type: String, required: true },
      count: { type: Number, required: true },
      marks: { type: Number, required: true },
    },
  ],
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  additionalInfo: { type: String },
  status: {
    type: String,
    enum: ['PENDING', 'GENERATING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  samplePapers: [SamplePaperSchema],
  generatedQuestions: { type: [Schema.Types.Mixed], default: [] },
  submittedCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now },
});

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
