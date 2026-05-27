import { ISamplePaper, ISection, IQuestion } from '../models/Assignment';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK with the provided API key
const genAI = new GoogleGenerativeAI("AIzaSyA2MThRkqqY9HIfix2L7V2-rkNNJOAKpvI");

/**
 * Uses Gemini API to generate 3 sample question papers based on the assignment parameters.
 */
export async function generateQuestionPaper(assignmentId: string, params: any): Promise<ISamplePaper[]> {
  const { questionTypes, totalQuestions, totalMarks, additionalInfo } = params;

  // Construct the prompt
  const prompt = `
You are an expert teacher creating a question paper.
I need 3 different sample variations of a question paper based on the following parameters:
- Total Questions: ${totalQuestions}
- Total Marks: ${totalMarks}
- Additional Info / Subject: ${additionalInfo || 'General'}
- Question Types Requirements: 
${questionTypes.map((qt: any) => `  * ${qt.count} questions of type "${qt.type}" (each worth ${qt.marks} marks)`).join('\n')}

Generate exactly 3 distinct sample papers.
Return the result STRICTLY as a JSON array where each object has a "sections" array.
Each section must have:
- "title" (string)
- "instruction" (string)
- "questions" (array of objects with "questionText" (string), "difficulty" ("Easy", "Moderate", or "Hard"), and "marks" (number)).

Ensure the output is pure JSON without markdown formatting, backticks, or explanatory text.
Example structure:
[
  {
    "sections": [
      {
        "title": "Section A",
        "instruction": "Attempt all questions",
        "questions": [
          { "questionText": "What is ...?", "difficulty": "Easy", "marks": 2 }
        ]
      }
    ]
  },
  { "sections": [...] },
  { "sections": [...] }
]
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting (e.g. ```json ... ```)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```/, '');
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.replace(/```$/, '');
    }

    const parsedPapers = JSON.parse(cleanedText);

    // Map to ISamplePaper schema
    const samplePapers: ISamplePaper[] = parsedPapers.map((paper: any, index: number) => ({
      id: `paper-${index + 1}`,
      isSelected: false,
      sections: paper.sections,
    }));

    return samplePapers;
  } catch (error) {
    console.error("Error generating question paper with Gemini API:", error);
    
    // Fallback logic if API fails
    const fallbackPapers: ISamplePaper[] = [];
    for (let p = 0; p < 3; p++) {
      const sections: ISection[] = [];
      const sectionLetters = ['A', 'B', 'C', 'D', 'E'];
      
      questionTypes.forEach((qt: any, index: number) => {
        const questions: IQuestion[] = [];
        for (let i = 0; i < qt.count; i++) {
          let difficulty: 'Easy' | 'Moderate' | 'Hard' = 'Easy';
          if (i % 3 === 1) difficulty = 'Moderate';
          if (i % 3 === 2) difficulty = 'Hard';

          questions.push({
            questionText: `[Fallback Paper ${p + 1}] Generated ${qt.type} question ${i + 1} regarding ${additionalInfo || 'the subject'}`,
            difficulty,
            marks: qt.marks,
          });
        }
        sections.push({
          title: `Section ${sectionLetters[index] || index + 1}: ${qt.type}`,
          instruction: `Attempt all ${qt.count} questions in this section.`,
          questions,
        });
      });

      fallbackPapers.push({
        id: `paper-fallback-${p + 1}`,
        isSelected: false,
        sections,
      });
    }

    return fallbackPapers;
  }
}
