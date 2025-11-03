# 🐝 Spelling Bee Prep

A modern, interactive spelling practice application built with React 18, TypeScript, and Material UI. Practice spelling with text-to-speech pronunciation, multiple difficulty levels, and helpful hints.

## Features

### 🎯 Practice Modes
- **Random Practice**: Practice words in random order
- **Difficulty-Based**: Focus on easy, medium, or hard words
- **Challenges**: Take on spelling challenges

### 🔊 Text-to-Speech
- Web Speech API for natural word pronunciation
- Automatic fallback for unsupported browsers
- Adjustable speech rate and volume

### 💡 Learning Aids
- Word definitions
- Usage examples
- Word origins
- Difficulty indicators

### 📊 Progress Tracking
- Real-time statistics
- Current streak counter
- Correct/incorrect tracking

### 🌐 Internationalization
- i18next integration
- Multi-language support ready

### 📱 Progressive Web App
- Offline support
- Installable on mobile devices
- Service worker caching

### 🔒 Security
- OWASP security best practices
- Content Security Policy
- HTTP security headers
- Input validation with Zod

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material UI (MUI)
- **Styling**: Emotion
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Testing**: Vitest, React Testing Library, Playwright
- **i18n**: react-i18next
- **PWA**: vite-plugin-pwa
- **Linting/Formatting**: ESLint, Prettier

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Scripts

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Project Structure

```
spelling-bee-prep/
├── src/
│   ├── app/                    # App configuration
│   │   ├── i18n.ts            # Internationalization setup
│   │   └── theme.ts           # Material UI theme
│   ├── components/            # Reusable components
│   │   └── Settings.tsx       # Settings dialog
│   ├── features/              # Feature modules
│   │   └── practice/          # Practice feature
│   │       ├── ModeSelector.tsx
│   │       ├── PracticeMode.tsx
│   │       └── store.ts       # Zustand store
│   ├── domain/                # Domain logic
│   │   └── services/
│   │       └── tts/           # Text-to-speech service
│   │           ├── web-speech-service.ts
│   │           ├── fallback-service.ts
│   │           ├── types.ts
│   │           └── index.ts
│   ├── data/                  # Data layer
│   │   └── dictionaries/      # Word dictionaries
│   │       ├── schema.ts      # Zod schemas
│   │       └── default-words.ts
│   ├── App.tsx               # Main app component
│   └── main.tsx              # App entry point
├── tests/
│   ├── unit/                 # Unit tests
│   ├── e2e/                  # E2E tests
│   └── setup.ts              # Test setup
├── public/                   # Static assets
└── ...config files

```

## Word Dictionary Format

Words are validated using Zod schemas:

```typescript
{
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  definition: string;
  usageExample?: string;
  origin?: string;
  phonetic?: string;
  category?: string;
}
```

## Browser Support

- Modern browsers with ES2022 support
- Web Speech API for TTS (with fallback)
- Progressive Web App features

## Security

See [SECURITY.md](./SECURITY.md) for details on:
- OWASP security measures
- Content Security Policy
- HTTP security headers
- Input validation
- Dependency management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
