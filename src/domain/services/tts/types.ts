export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface TTSService {
  speak(text: string, options?: TTSOptions): Promise<void>;
  cancel(): void;
  isSupported(): boolean;
  getVoices(): Promise<SpeechSynthesisVoice[]>;
}

export type TTSProvider = 'web-speech' | 'fallback';
