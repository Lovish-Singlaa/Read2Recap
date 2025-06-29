'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Settings } from 'lucide-react';
import { DEFAULT_VOICES } from '@/lib/murf';
import axios from 'axios';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AudioPlayerProps {
  text: string;
  documentId: string;
  existingAudioUrl?: string;
  onAudioGenerated?: (audioUrl: string) => void;
}

export default function AudioPlayer({ text, documentId, existingAudioUrl, onAudioGenerated }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICES[0].id);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (existingAudioUrl) {
      setAudioUrl(existingAudioUrl);
    }
  }, [existingAudioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setIsAudioLoaded(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      updateDuration();
    };

    const handleCanPlay = () => {
      setIsAudioLoaded(true);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsAudioLoaded(false);
      setDuration(0);
      setCurrentTime(0);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Initial duration check
    if (audio.readyState >= 1) {
      updateDuration();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const generateAudio = async () => {
    if (!text.trim()) {
      toast.error('No text to convert to speech');
      return;
    }

    setIsLoading(true);
    try {
      // Clean the text before sending to TTS API
      const cleanText = text
        .replace(/^#+\s+/gm, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
        .replace(/\n+/g, ' ') // Replace multiple newlines with single space
        .trim();

      if (!cleanText) {
        toast.error('No valid text content found after cleaning');
        return;
      }

      const response = await axios.post('/api/tts/generate', {
        text: cleanText.substring(0, 3000), // Limit to 3000 characters
        voice_id: selectedVoice,
        speed: 1,
        pitch: 0,
      });

      if (response.data.success) {
        setAudioUrl(response.data.audio_url);
        onAudioGenerated?.(response.data.audio_url);
        toast.success('Audio generated successfully!');
        // Reset audio state for new audio
        setCurrentTime(0);
        setDuration(0);
        setIsAudioLoaded(false);
      } else {
        toast.error(response.data.error || 'Failed to generate audio');
      }
    } catch (error: any) {
      console.error('Error generating audio:', error);
      
      // Show more specific error messages
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to generate audio. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!audioUrl) {
      generateAudio();
      return;
    }

    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Error playing audio');
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !isAudioLoaded) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (clickX / width) * duration;
    
    if (!isNaN(clickTime) && clickTime >= 0) {
      audioRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full md:min-w-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Audio Player</h3>
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60 text-xs" align="end">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Audio Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {DEFAULT_VOICES.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Playback Speed
                  </label>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {audioUrl && !isLoading && (
          <button
            onClick={generateAudio}
            className="flex items-center justify-center w-8 h-8 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            title="Regenerate audio"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}

        <div className="flex-1">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative"
          >
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          onClick={resetAudio}
          className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-12"
          />
        </div>
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
          preload="metadata"
        />
      )}

      {!audioUrl && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm mb-2">
            Click the play button to generate audio from this summary
          </p>
          <p className="text-xs text-gray-400">
            Text will be limited to 3000 characters for audio generation
          </p>
        </div>
      )}

      {audioUrl && (
        <div className="text-center py-2">
          <p className="text-green-600 text-sm">
            ✓ Audio is ready to play
          </p>
        </div>
      )}
    </div>
  );
} 