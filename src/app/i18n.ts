import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Spelling Bee Prep',
        description: 'Practice spelling with interactive challenges',
      },
      practice: {
        title: 'Practice Mode',
        startPractice: 'Start Practice',
        nextWord: 'Next Word',
        repeatWord: 'Repeat Word',
        hint: 'Show Hint',
        submit: 'Submit',
        checkAnswer: 'Check Answer',
        correct: 'Correct!',
        incorrect: 'Incorrect',
        tryAgain: 'Try Again',
        modes: {
          random: 'Random',
          difficulty: 'By Difficulty',
          challenges: 'Challenges',
        },
        difficulty: {
          easy: 'Easy',
          medium: 'Medium',
          hard: 'Hard',
        },
        hints: {
          definition: 'Definition',
          usageExample: 'Usage Example',
          origin: 'Origin',
        },
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        speechRate: 'Speech Rate',
        volume: 'Volume',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
