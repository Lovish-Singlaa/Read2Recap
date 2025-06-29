import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createMurfClient } from '@/lib/murf';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { text, voice_id, speed = 1, pitch = 0 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Limit text length to 3000 characters as per Murf API limits
    if (text.length > 3000) {
      return NextResponse.json(
        { error: 'Text must be 3000 characters or less' },
        { status: 400 }
      );
    }

    // Clean the text - remove markdown and extra whitespace
    const cleanText = text
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\n+/g, ' ') // Replace multiple newlines with single space
      .replace(/📋|🔍|📊|💡|🎯|📝/g, '') // Remove emojis
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    if (!cleanText) {
      return NextResponse.json(
        { error: 'No valid text content found after cleaning' },
        { status: 400 }
      );
    }

    console.log('TTS Request:', {
      text: cleanText.substring(0, 100) + '...',
      voice_id,
      textLength: cleanText.length,
      originalTextLength: text.length
    });

    const murfClient = createMurfClient();
    
    // Try different approaches for voice ID
    let result;
    let lastError;
    
    // First try: with provided voice_id
    if (voice_id) {
      try {
        result = await murfClient.generateSpeech({
          text: cleanText,
          voiceId: voice_id,
          format: 'MP3',
        });
      } catch (error: any) {
        console.log('Failed with voice_id:', voice_id, error.message);
        lastError = error;
      }
    }
    
    // Second try: without voice_id (let Murf choose default)
    if (!result) {
      try {
        result = await murfClient.generateSpeech({
          text: cleanText,
          format: 'MP3',
        });
      } catch (error: any) {
        console.log('Failed without voice_id:', error.message);
        lastError = error;
      }
    }
    
    // Third try: with a very basic voice ID
    if (!result) {
      try {
        result = await murfClient.generateSpeech({
          text: cleanText,
          voiceId: 'en-US',
          format: 'MP3',
        });
      } catch (error: any) {
        console.log('Failed with basic voice_id:', error.message);
        lastError = error;
      }
    }

    if (!result) {
      throw lastError || new Error('All voice ID attempts failed');
    }

    return NextResponse.json({
      success: true,
      audio_url: result.audioFile,
      duration: result.audioLengthInSeconds,
      word_timestamps: result.wordDurations,
      consumed_characters: result.consumedCharacterCount,
      remaining_characters: result.remainingCharacterCount,
    });

  } catch (error: any) {
    console.error('TTS generation error:', error);
    
    // Return more specific error messages
    if (error.message.includes('Murf API Error:')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    } else if (error.message.includes('MURF_API_KEY')) {
      return NextResponse.json(
        { error: 'TTS service configuration error' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to generate speech. Please try again.' },
        { status: 500 }
      );
    }
  }
} 