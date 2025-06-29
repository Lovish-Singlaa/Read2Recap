import { GoogleGenerativeAI } from '@google/generative-ai';
import { prompt } from '@/utils/prompt';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function processGeminiResponse(response: string): string {
  // Find the first occurrence of a markdown title (# followed by text)
  const titleMatch = response.match(/^#\s+(.+)$/m);
  
  if (titleMatch) {
    // Find the index of the first title
    const titleIndex = response.indexOf(titleMatch[0]);
    
    // Return everything from the first title onwards
    return response.substring(titleIndex).trim();
  }
  
  // If no title found, return the original response
  return response.trim();
}

export async function generateSummaryFromGemini(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig: { temperature: 0.7, maxOutputTokens: 1500 } });

    const finalPrompt = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              text: `${prompt}\n\nPlease provide a comprehensive summary of the following document. Focus on the main points, key insights, and important details. Make the summary clear and well-structured:\n\n${content}`
            }]
        }]
    }

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;

    if(!response.text()){
      throw new Error('Failed to generate summary');
    }

    // Process the response to trim everything before the first title
    const processedResponse = processGeminiResponse(response.text());
    
    return processedResponse;
  } catch (error) {
    console.error('Error summarizing document:', error);
    throw new Error('Failed to summarize document');
  }
}