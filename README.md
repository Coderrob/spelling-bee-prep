# Spelling Bee Prep

Practice spelling with confidence using a modern, accessible training companion built with React, TypeScript, and Material UI.

<p align="center">
  <img src="public/img/spelling-bee.png" alt="Spelling Bee Practice UI" width="360">
</p>

---

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the app locally**

   ```bash
   npm run dev
   ```

3. **Open** `http://localhost:5173` in your browser and start spelling.

Need a production build? Run `npm run build` followed by `npm run preview`.

---

## Highlights

- Guided practice flows for random drills, filtered sessions, and challenges.
- Text-to-speech playback with adjustable rate and volume controls.
- On-demand hints covering definitions, usage examples, and word origins.
- Real-time statistics and insights to monitor streaks, accuracy, and missed words.
- Responsive, keyboard-friendly UI with internationalization support.
- Progressive Web App features for offline use and installable experiences.

---

## UI Preview

![Spelling Bee UI](public/img/spelling-bee-ui.png)

The practice screen keeps the word input focused, offers quick hint toggles, and surfaces current streaks, accuracy, and charts in one glance.

---

## Tech Overview

- **Framework**: React 18 + TypeScript
- **UI**: Material UI (MUI) with Emotion styling
- **State**: Zustand
- **Forms & Validation**: React Hook Form + Zod
- **Speech**: Web Speech API with fallbacks
- **Charts**: Apache ECharts
- **Tooling**: Vite, ESLint, Prettier
- **Testing**: Vitest, React Testing Library, Playwright
- **PWA**: vite-plugin-pwa

---

## Project Structure (abridged)

| Path | Purpose |
| --- | --- |
| `public/` | Static assets and icons |
| `src/app/` | Root providers and global configuration |
| `src/components/` | Reusable UI elements |
| `src/features/practice/` | Spelling practice flows, panels, and analytics |
| `src/store/` | Zustand stores |
| `src/domain/` | Domain logic and service abstractions |
| `src/data/` | Dictionaries, loaders, and schemas |
| `src/utils/` | Shared helpers and guards |
| `tests/` | Unit and end-to-end test suites |

---

## Helpful Scripts

```bash
npm test             # Unit tests
npm run test:ui      # Vitest UI
npm run test:e2e     # Playwright E2E
npm run lint         # ESLint
npm run format       # Prettier
```

---

## Security

We follow OWASP-aligned practices, enforce CSP and security headers, and validate input with Zod. See [SECURITY.md](./SECURITY.md) for more detail.

---

## Contributing

1. Fork the repository.
2. Create a branch (`git checkout -b feature/amazing-idea`).
3. Commit your changes (`git commit -m "Add amazing idea"`).
4. Run the tests and linters.
5. Open a pull request.

---

## License

Released under the MIT License. Happy spelling!
