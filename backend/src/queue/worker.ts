import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { Assignment } from '../models/Assignment';
import { broadcast } from '../websocket';
import { GoogleGenerativeAI } from '@google/generative-ai';
const pdf = require('pdf-parse');

const redisOptions: any = { maxRetriesPerRequest: null };
const redisConnection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, redisOptions)
  : new IORedis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });

export const generationQueue = new Queue('generationQueue', { connection: redisConnection });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyA2MThRkqqY9HIfix2L7V2-rkNNJOAKpvI');

export async function addGenerationJob(assignmentId: string, params: any) {
  await generationQueue.add('generatePaper', { assignmentId, params });
  console.log(`[BullMQ] Job added to queue for assignment: ${assignmentId}`);
}

const worker = new Worker('generationQueue', async (job: Job) => {
  const { assignmentId, params } = job.data;
  console.log(`[BullMQ Worker] Processing job for assignment: ${assignmentId}`);
  
  try {
    const { subject, questionTypes, additionalInfo, fileData, fileMimeType } = params;
    
    const prompt = `You are an expert exam paper generator.
Generate an exam paper for the subject: ${subject}.
Constraints / Extra Info: ${additionalInfo || 'None'}.
Requirements:
${questionTypes.map((qt: any) => `- ${qt.count} ${qt.type} questions (each worth ${qt.marks} marks)`).join('\n')}

Based on the provided reference document, generate the questions. 
Make sure the questions ONLY cover the material in the uploaded document. Do NOT generate questions outside the scope of the document.
Return ONLY a JSON array of questions, where each question has:
- text: string (the question text)
- type: string (the type of question, e.g. "Multiple Choice", "Short Questions")
- options: string[] (array of 4 options if the type is "Multiple Choice", otherwise omit or empty)
- marks: number
- difficulty: string (Easy, Moderate, or Challenging)
- answer: string (the correct answer for the answer key)
Do not include markdown blocks like \`\`\`json.`;

    let generatedQuestions = [];

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      const parts: any[] = [{ text: prompt }];
      
      if (fileData && fileMimeType) {
        parts.push({
          inlineData: { data: fileData, mimeType: fileMimeType }
        });
      }

      const result = await model.generateContent(parts);
      let text = result.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) throw new Error('Failed to find JSON array in response');
      generatedQuestions = JSON.parse(jsonMatch[0]);
    } catch (geminiError) {
      console.error('[BullMQ Worker] Gemini API Generation error, falling back to GPT OSS:', geminiError);
      
      const apiKey = process.env.GPT_OSS_API_KEY;
      if (!apiKey) throw new Error('GPT_OSS_API_KEY not configured');

      let documentText = '';
      if (fileData) {
        const buffer = Buffer.from(fileData, 'base64');
        if (fileMimeType === 'application/pdf') {
          const pdfFunc = typeof pdf === 'function' ? pdf : (pdf.default || pdf.PDFParse);
          const pdfData = await pdfFunc(buffer);
          documentText = pdfData.text;
        } else if (fileMimeType.includes('text')) {
          documentText = buffer.toString('utf-8');
        }
      }

      const content = `You are an expert exam paper generator.
Generate a highly professional, well-structured exam paper for the subject: ${subject}.
Constraints / Extra Info: ${additionalInfo || 'None'}.
Requirements:
${questionTypes.map((qt: any) => `- ${qt.count} ${qt.type} questions (each worth ${qt.marks} marks)`).join('\n')}

${documentText ? `Based on the provided reference document below, generate the questions.\nMake sure the questions ONLY cover the material in the document. Do NOT generate mock questions or outside questions.\n\nDocument Content:\n${documentText.substring(0, 30000)}` : 'Generate questions based on standard curriculum for this subject.'}

Return ONLY a JSON array of questions, where each question has:
- text: string (the question text)
- type: string (the type of question, e.g. "Short Questions")
- marks: number
- difficulty: string (Easy, Moderate, or Challenging)
- answer: string (the correct answer for the answer key)
Do not include markdown blocks like \`\`\`json.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [{ role: 'user', content }],
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(`GPT OSS API Error: ${errData}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from OpenRouter: ' + JSON.stringify(data));
      }

      let text = data.choices[0].message.content;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Failed to find JSON array in fallback response: ' + text);
      generatedQuestions = JSON.parse(jsonMatch[0]);
    }
    
    await Assignment.findByIdAndUpdate(assignmentId, {
      generatedQuestions,
      status: 'COMPLETED',
    });
    
    console.log(`[BullMQ Worker] Job completed for assignment: ${assignmentId}`);
    broadcast({ type: 'GENERATION_COMPLETED', assignmentId });
    
  } catch (error) {
    console.error(`[BullMQ Worker] Job failed for assignment: ${assignmentId}`, error);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'FAILED' });
    broadcast({ type: 'GENERATION_FAILED', assignmentId });
    throw error; // Let BullMQ handle retries if configured
  }
}, { connection: redisConnection });

worker.on('failed', (job, err) => {
  console.error(`[BullMQ] Job ${job?.id} failed: ${err.message}`);
});
