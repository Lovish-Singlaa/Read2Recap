import axios from 'axios';

interface MurfTTSRequest {
  text: string;
  voiceId?: string;
  format?: string;
  sampleRate?: number;
  rate?: number;
  pitch?: number;
  style?: string;
  modelVersion?: string;
  channelType?: string;
}

interface MurfTTSResponse {
  audioFile: string;
  audioLengthInSeconds: number;
  consumedCharacterCount: number;
  remainingCharacterCount: number;
  wordDurations?: Array<{
    word: string;
    startTime: number;
    endTime: number;
  }>;
  encodedAudio?: string;
  warning?: string;
}

export class MurfAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.murf.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpeech(params: MurfTTSRequest): Promise<MurfTTSResponse> {
    try {
      console.log('Murf API Request:', JSON.stringify(params, null, 2));
      
      const response = await axios.post(
        `${this.baseURL}/speech/generate`,
        params,
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Murf API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Murf API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        requestData: params
      });
      
      if (error.response?.data?.errorMessage) {
        throw new Error(`Murf API Error: ${error.response.data.errorMessage}`);
      } else if (error.response?.status === 400) {
        throw new Error('Invalid request parameters. Please check voice ID and text format.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your MURF_API_KEY.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`Failed to generate speech: ${error.message}`);
      }
    }
  }

  async getVoices() {
    try {
      const response = await axios.get(`${this.baseURL}/speech/voices`, {
        headers: {
          'api-key': this.apiKey,
        },
      });

      console.log('Available Murf Voices:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Murf API Error:', error);
      throw new Error('Failed to fetch voices');
    }
  }
}

// Revert to original voice IDs that were working before
export const DEFAULT_VOICES = [
  { id: 'en-US-amy', name: 'Amy (Female)', language: 'en-US' },
  { id: 'en-US-josh', name: 'Josh (Male)', language: 'en-US' },
  { id: 'en-US-sarah', name: 'Sarah (Female)', language: 'en-US' },
  { id: 'en-US-terrell', name: 'Terrell (Male)', language: 'en-US' },
];

export const createMurfClient = () => {
  const apiKey = process.env.MURF_API_KEY;
  if (!apiKey) {
    throw new Error('MURF_API_KEY environment variable is required');
  }
  return new MurfAPI(apiKey);
}; 