# Ten implemented improvements

1. **Validated curriculum model** — grade, difficulty, source attribution, definitions, examples, and progress data are checked with Zod at repository boundaries and during every build.
2. **Repository and adapter boundary** — `DictionaryService` depends on `IDictionaryLoader`; bundled and JSON loaders hide storage details from the app and domain.
3. **Grade-targeted catalog** — 3,300 attributed words cover Kindergarten through Grade 12 with exact per-grade targets and relative easy/medium/hard bands.
4. **Selection strategy pattern** — random, difficulty, challenge, and adaptive algorithms implement one selection contract instead of branching throughout the UI and store.
5. **Explicit session state machine** — pure events and transitions govern idle, presenting, answered, and exhausted states, preventing invalid practice transitions.
6. **Container/presenter split** — `PracticePanel` is a thin entry point, `usePracticeSessionController` coordinates effects, and `PracticeView` renders the controller contract.
7. **Focused state stores** — catalog, practice session, learner progress, and settings have separate ownership instead of one oversized mutable store.
8. **Repository-backed spaced repetition** — a Leitner-style mastery policy schedules due words, while a versioned progress repository isolates browser persistence and legacy migration.
9. **Resilient speech chain** — a TTS factory creates engines and a chain of responsibility falls back at runtime when the preferred engine is unsupported or fails.
10. **Pure analytics and quality guardrails** — analytics view models and chart options are separated; lint complexity limits, content contracts, unit tests, browser tests, build validation, and duplication checks prevent complexity from returning.

Dependency versions were also updated in `package.json` and the lockfile. See `ARCHITECTURE.md` for dependency direction and `CURRICULUM.md` for catalog sourcing and placement rules.
