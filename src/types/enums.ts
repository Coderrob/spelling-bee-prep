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

/** Grade bands for categorizing words by educational level. */
export enum GradeBand {
  K_TO_2 = 'k-2',
  THREE_TO_5 = '3-5',
  SIX_TO_8 = '6-8',
  NINE_TO_12 = '9-12',
}

/** Difficulty levels assigned to words. */
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/** Modes available for practicing words. */
export enum PracticeMode {
  RANDOM = 'random',
  DIFFICULTY = 'difficulty',
  CHALLENGES = 'challenges',
}

/** Types of hints that can be provided for a word. */
export enum HintType {
  DEFINITION = 'definition',
  USAGE_EXAMPLE = 'usageExample',
  ORIGIN = 'origin',
}

/** Supported locale codes for the application. */
export enum LocaleCode {
  EN_US = 'en-US',
  ES_ES = 'es-ES',
  FR_FR = 'fr-FR',
}

/** Text-to-Speech engines available for pronunciation. */
export enum TtsEngine {
  WEB_SPEECH = 'web-speech',
  ESPEAK_WASM = 'espeak-wasm',
  OPEN_TTS = 'open-tts',
}

/** Size options for UI components. */
export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}
