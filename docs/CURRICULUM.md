# Grade-level curriculum

Bundled English-US word packs live in `src/data/dictionaries/en-US`. Each file represents one grade from Kindergarten through Grade 12 and is validated at build time.

The catalog contains 3,300 entries across all 13 grades: 100 for Kindergarten, 175 each for Grades 1-2, 250 each for Grades 3-5, and 300 each for Grades 6-12.

- Kindergarten: sound-to-letter mapping and CVC words.
- Grades 1–2: blends, digraphs, vowel teams, and high-frequency irregular words.
- Grades 3–5: syllable division, affixes, morphology, and general academic vocabulary.
- Grades 6–8: Greek and Latin roots, content vocabulary, and borrowed spellings.
- Grades 9–12: advanced academic, literary, rhetorical, and competition vocabulary.

Difficulty is relative to the selected grade. Each pack must contain easy, medium, and hard entries; a mature pack should aim for roughly 20% review, 60% on-level, and 20% challenge material.

## Source and placement

The catalog is derived from the CC BY-SA 4.0 Grundwortschatz English lexical dataset. The reproducible importer keeps entries backed by its curriculum, Fry, CEFR, or commonly-misspelled source lists; removes learner-error spellings, names, alternate-spelling definitions, and very rare entries; and normalizes American variants when source metadata provides one.

The source estimates Grades 1-6. Kindergarten takes the simplest one-syllable early words. Grades 7-12 are assigned from eligible source vocabulary by a score combining spelling length, syllables, frequency, learner-error evidence, and uncommon letter clusters. Words are ordered by that score before each grade receives its 20/60/20 difficulty bands. Placement is a practice progression, not a claim of alignment with a particular school district's standards.

See `THIRD_PARTY-NOTICES.md` for attribution and licensing. To reproduce the checked-in packs, download `grundwortschatz_en.db.gz`, decompress it, and run:

```bash
python scripts/import_grundwortschatz.py grundwortschatz_en.db src/data/dictionaries/en-US
npm exec -- prettier --write "src/data/dictionaries/en-US/*.json"
```

## Adding words

Add entries to the appropriate `grade-*.json` file. Every entry requires:

- a globally stable kebab-case `id`;
- the spelling and exact `gradeLevel` of its containing pack;
- within-grade `difficulty`;
- a concise, child-appropriate definition;
- `sourceId` matching an attributed source in the pack.

Part of speech, syllable count, spelling patterns, pronunciation, origin, category, and a usage example may also be supplied. Usage examples must replace the spelling word with a blank, because build validation rejects examples that reveal the answer.

Run `npm run validate:content` before submitting a pack. It rejects invalid metadata, mismatched grades, duplicated IDs or spellings, missing source attribution, answer leakage, missing grade coverage, and missing difficulty coverage.
