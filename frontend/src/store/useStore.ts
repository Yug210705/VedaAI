import { create } from 'zustand';

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

interface AssignmentState {
  title: string;
  subject: string;
  studentClass: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInfo: string;
  setTitle: (title: string) => void;
  setSubject: (subject: string) => void;
  setStudentClass: (studentClass: string) => void;
  setDueDate: (date: string) => void;
  addQuestionType: (qt: QuestionType) => void;
  updateQuestionType: (index: number, qt: Partial<QuestionType>) => void;
  removeQuestionType: (index: number) => void;
  setAdditionalInfo: (info: string) => void;
  resetForm: () => void;
}

const initialState = {
  title: 'New Assignment',
  subject: '',
  studentClass: '',
  dueDate: '',
  questionTypes: [
    { type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { type: 'Short Questions', count: 3, marks: 2 },
  ],
  additionalInfo: '',
};

export const useAssignmentStore = create<AssignmentState>((set) => ({
  ...initialState,
  setTitle: (title) => set({ title }),
  setSubject: (subject) => set({ subject }),
  setStudentClass: (studentClass) => set({ studentClass }),
  setDueDate: (dueDate) => set({ dueDate }),
  addQuestionType: (qt) => set((state) => ({ questionTypes: [...state.questionTypes, qt] })),
  updateQuestionType: (index, qt) => set((state) => {
    const newTypes = [...state.questionTypes];
    newTypes[index] = { ...newTypes[index], ...qt };
    return { questionTypes: newTypes };
  }),
  removeQuestionType: (index) => set((state) => ({
    questionTypes: state.questionTypes.filter((_, i) => i !== index)
  })),
  setAdditionalInfo: (additionalInfo) => set({ additionalInfo }),
  resetForm: () => set(initialState),
}));
