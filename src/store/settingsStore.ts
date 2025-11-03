import { create } from 'zustand';
import { LocaleCode } from '@/types';
import {
  DEFAULT_SPEECH_RATE,
  DEFAULT_SPEECH_VOLUME,
  DEFAULT_SPEECH_PITCH,
} from '@/types/constants';

/** State interface for application settings. */
interface SettingsState {
  locale: LocaleCode;
  speechRate: number;
  speechVolume: number;
  speechPitch: number;
}

/** Actions interface for modifying application settings. */
interface SettingsActions {
  setLocale: (locale: LocaleCode) => void;
  setSpeechRate: (rate: number) => void;
  setSpeechVolume: (volume: number) => void;
  setSpeechPitch: (pitch: number) => void;
}

/** Combined type representing the full settings store. */
type SettingsStore = SettingsState & SettingsActions;

/** Zustand store for managing application settings such as locale and TTS parameters. */
export const useSettingsStore = create<SettingsStore>((set) => ({
  locale: LocaleCode.EN_US,
  speechRate: DEFAULT_SPEECH_RATE,
  speechVolume: DEFAULT_SPEECH_VOLUME,
  speechPitch: DEFAULT_SPEECH_PITCH,

  setLocale: (locale) => set({ locale }),
  setSpeechRate: (rate) => set({ speechRate: rate }),
  setSpeechVolume: (volume) => set({ speechVolume: volume }),
  setSpeechPitch: (pitch) => set({ speechPitch: pitch }),
}));
