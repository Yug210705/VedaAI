const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyA2MThRkqqY9HIfix2L7V2-rkNNJOAKpvI');

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const result = await model.generateContent('hello');
    console.log(result.response.text());
  } catch (e) {
    console.error('ERROR', e);
  }
}
run();
