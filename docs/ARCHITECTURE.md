# Architecture

Spelling Bee Prep uses a small ports-and-adapters design around three independent state areas.

- `catalogStore` loads validated, grade-specific curriculum through `DictionaryService` and an `IDictionaryLoader` adapter.
- `practiceStore` is the short-lived session adapter. Pure state transitions live in `domain/practice/sessionMachine.ts`; word choice lives behind strategy objects.
- `progressStore` owns durable attempts and mastery. `LocalProgressRepository` is the browser adapter and can later be replaced without changing session rules.

The practice UI follows a container/presenter split. `PracticePanel` creates a controller with `usePracticeSessionController`, while `PracticeView` renders only the controller contract. Analytics are computed by the pure `buildPracticeAnalytics` function and translated separately into ECharts configuration.

Text-to-speech uses a factory and chain of responsibility. A preferred engine is tried first, followed by supported local fallbacks; runtime failure advances to the next engine.

## Dependency direction

```text
UI -> stores/controllers -> domain policies
                      \-> service ports <- browser/bundled adapters
```

Domain modules do not import React, Zustand, browser storage, or chart libraries. ESLint enforces complexity, nesting, and function-size limits for this layer.

## Verification

Run `npm run check` for formatting, linting, unit and content tests, a production build, and duplication analysis. Run `npm run test:e2e` for browser workflows.
