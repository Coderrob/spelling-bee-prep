/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
