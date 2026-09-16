"""Build the checked-in K-12 curriculum from a licensed lexical SQLite database."""

from __future__ import annotations

import argparse
import json
import math
import re
import sqlite3
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path
from typing import Any

TARGETS = {
    "K": 100,
    "1": 175,
    "2": 175,
    "3": 250,
    "4": 250,
    "5": 250,
    "6": 300,
    "7": 300,
    "8": 300,
    "9": 300,
    "10": 300,
    "11": 300,
    "12": 300,
}
SOURCE = {
    "id": "grundwortschatz-en",
    "name": "Grundwortschatz English lexical dataset",
    "license": "CC-BY-SA-4.0",
    "url": "https://huggingface.co/datasets/cstr/grundwortschatz-voc-en",
}
WORD_PATTERN = re.compile(r"^[a-z]{2,24}$")
TWO_LETTER_WORDS = {
    "am", "an", "as", "at", "be", "by", "do", "go", "he", "if", "in", "is", "it",
    "me", "my", "no", "of", "oh", "on", "or", "so", "to", "up", "us", "we",
}
VOWEL_GROUP = re.compile(r"[aeiouy]+")
DOUBLE_CONSONANT = re.compile(r"([bcdfghjklmnpqrstvwxyz])\1")
TRUSTED_SOURCE_TAGS = {
    "source:cefr_j",
    "source:common_misspelled",
    "source:curriculum_added",
    "source:fry",
}


@dataclass(frozen=True)
class Candidate:
    source_id: int
    word: str
    source_grade: int
    part_of_speech: str
    definition: str
    phonetic: str | None
    syllables: int
    example: str | None
    zipf: float
    complexity: float
    patterns: list[str]


def parse_json(value: str | None) -> dict[str, Any]:
    if not value:
        return {}
    parsed = json.loads(value)
    return parsed if isinstance(parsed, dict) else {}


def concise_definition(word: str, enrichment: dict[str, Any]) -> str | None:
    definitions = enrichment.get("definitions", [])
    usable = [
        text.strip()
        for text in definitions
        if isinstance(text, str) and 12 <= len(text.strip()) <= 220
        and not re.search(rf"\b{re.escape(word)}\b", text, flags=re.IGNORECASE)
        and not any(
            phrase in text.lower()
            for phrase in (
                "given name",
                "family name",
                "standard spelling of",
                "surname",
                "municipality in",
                "city in",
            )
        )
        and not re.search(r"\(\d{4}[-–]\d{4}\)", text)
    ]
    return min(usable, key=len) if usable else None


def syllable_count(word: str, metadata: dict[str, Any]) -> int:
    pronunciation = metadata.get("pronunciation", {})
    arpabet = pronunciation.get("arpabet", []) if isinstance(pronunciation, dict) else []
    phoneme_count = sum(
        1 for phoneme in arpabet if isinstance(phoneme, str) and any(char.isdigit() for char in phoneme)
    )
    if phoneme_count > 0:
        return phoneme_count
    groups = VOWEL_GROUP.findall(word)
    silent_e = word.endswith("e") and len(groups) > 1 and not word.endswith(("le", "ee"))
    return max(1, len(groups) - int(silent_e))


def masked_example(word: str, metadata: dict[str, Any], source_grade: int) -> str | None:
    examples = metadata.get("grade_examples", {})
    if not isinstance(examples, dict):
        return None
    grade_examples = examples.get(str(min(source_grade, 6)), [])
    if not isinstance(grade_examples, list):
        return None
    for sentence in grade_examples:
        if not isinstance(sentence, str):
            continue
        masked = re.sub(rf"\b{re.escape(word)}\b", "___", sentence.strip(), flags=re.IGNORECASE)
        if masked != sentence.strip() and word not in masked.lower():
            return masked
    return None


def spelling_patterns(word: str, syllables: int) -> list[str]:
    patterns: list[str] = []
    if DOUBLE_CONSONANT.search(word):
        patterns.append("doubled consonant")
    for suffix in ("tion", "sion", "ment", "ness", "able", "ible", "ous", "ious", "ity"):
        if word.endswith(suffix):
            patterns.append(f"suffix {suffix}")
            break
    for pattern in ("ough", "eigh", "ph", "ch", "sh", "th", "ai", "oa", "ee"):
        if pattern in word:
            patterns.append(f"letter pattern {pattern}")
            break
    if word.startswith(("kn", "wr", "ps", "gn")):
        patterns.append("silent initial consonant")
    if not patterns:
        patterns.append("multisyllable" if syllables > 1 else "foundational spelling")
    return patterns


def complexity_score(word: str, syllables: int, zipf: float, metadata: dict[str, Any]) -> float:
    learner_errors = metadata.get("commonLearnerErrors", [])
    error_count = len(learner_errors) if isinstance(learner_errors, list) else 0
    rare_clusters = sum(word.count(cluster) for cluster in ("ough", "eigh", "ph", "rh", "ps", "mn"))
    return len(word) + syllables * 1.8 + max(0, 6 - zipf) * 2 + error_count * 0.3 + rare_clusters * 2


def load_candidates(database: Path) -> list[Candidate]:
    connection = sqlite3.connect(database)
    connection.row_factory = sqlite3.Row
    rows = list(connection.execute("SELECT * FROM words"))
    error_spellings: set[str] = set()
    for row in rows:
        metadata = parse_json(row["metadata_json"])
        errors = metadata.get("commonLearnerErrors", [])
        if isinstance(errors, list):
            error_spellings.update(
                str(error.get("error", "")).lower()
                for error in errors
                if isinstance(error, dict)
            )
    candidates: list[Candidate] = []
    seen: set[str] = set()
    for row in rows:
        original_word = str(row["word"]).strip()
        metadata = parse_json(row["metadata_json"])
        variants = metadata.get("spellingVariants", [])
        american_variant = next(
            (
                variant.get("variant")
                for variant in variants
                if isinstance(variant, dict)
                and variant.get("dialect") == "american"
                and isinstance(variant.get("variant"), str)
            ),
            None,
        ) if isinstance(variants, list) else None
        word = str(american_variant or original_word).strip().lower()
        if (
            original_word != original_word.lower()
            or word in seen
            or word in error_spellings
            or not WORD_PATTERN.fullmatch(word)
            or (len(word) == 2 and word not in TWO_LETTER_WORDS)
        ):
            continue
        enrichment = parse_json(row["enrichment_json"])
        definition = concise_definition(word, enrichment)
        tags = metadata.get("tags", [])
        if (
            not definition
            or not isinstance(tags, list)
            or not TRUSTED_SOURCE_TAGS.intersection(tags)
            or "misspelling of" in definition.lower()
            or any(
                phrase in definition.lower()
                for phrase in ("given name", "family name", "surname", "municipality in", "city in")
            )
            or (
                isinstance(tags, list)
                and "source:common_misspelled" in tags
                and not any(
                    isinstance(tag, str)
                    and tag.startswith("source:")
                    and tag != "source:common_misspelled"
                    for tag in tags
                )
            )
        ):
            continue
        frequency = parse_json(row["frequency_json"])
        zipf = float(frequency.get("zipf", 0))
        if zipf < 2:
            continue
        syllables = syllable_count(word, metadata)
        candidates.append(
            Candidate(
                source_id=int(row["id"]),
                word=word,
                source_grade=int(row["grade_level"]),
                part_of_speech=str(row["word_type"] or "word"),
                definition=definition,
                phonetic=metadata.get("ipaPhoneme") if isinstance(metadata.get("ipaPhoneme"), str) else None,
                syllables=syllables,
                example=masked_example(word, metadata, int(row["grade_level"])),
                zipf=zipf,
                complexity=complexity_score(word, syllables, zipf, metadata),
                patterns=spelling_patterns(word, syllables),
            )
        )
        seen.add(word)
    connection.close()
    return candidates


def take(pool: Iterable[Candidate], count: int, used: set[str]) -> list[Candidate]:
    selected: list[Candidate] = []
    for candidate in pool:
        if candidate.word in used:
            continue
        selected.append(candidate)
        used.add(candidate.word)
        if len(selected) == count:
            break
    if len(selected) != count:
        raise RuntimeError(f"Needed {count} candidates but found {len(selected)}")
    return selected


def select_curriculum(candidates: list[Candidate]) -> dict[str, list[Candidate]]:
    minimum_length = {1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7}
    maximum_length = {1: 7, 2: 10, 3: 12, 4: 14, 5: 16, 6: 18}
    by_grade = {
        grade: sorted(
            (
                candidate
                for candidate in candidates
                if candidate.source_grade == grade
                and minimum_length[grade] <= len(candidate.word) <= maximum_length[grade]
            ),
            key=lambda candidate: (candidate.complexity, -candidate.zipf, candidate.word),
        )
        for grade in range(1, 7)
    }
    selected: dict[str, list[Candidate]] = {}
    used: set[str] = set()
    early_pool = sorted(
        (candidate for candidate in candidates if candidate.source_grade <= 2),
        key=lambda candidate: (candidate.complexity, -candidate.zipf, candidate.word),
    )
    selected["K"] = take(
        (candidate for candidate in early_pool if candidate.syllables == 1 and len(candidate.word) <= 5),
        TARGETS["K"],
        used,
    )
    selected["1"] = take(
        (candidate for candidate in early_pool if candidate.syllables <= 2 and len(candidate.word) <= 7),
        TARGETS["1"],
        used,
    )
    grade_two_pool = sorted(
        (
            candidate
            for candidate in candidates
            if candidate.source_grade <= 3 and candidate.syllables <= 3 and 4 <= len(candidate.word) <= 10
        ),
        key=lambda candidate: (candidate.complexity, -candidate.zipf, candidate.word),
    )
    selected["2"] = take(grade_two_pool, TARGETS["2"], used)
    for grade in range(3, 7):
        adjacent_pool = sorted(
            (
                candidate
                for candidate in candidates
                if max(3, grade - 1) <= candidate.source_grade <= min(6, grade + 1)
                and minimum_length[grade] <= len(candidate.word) <= maximum_length[grade]
            ),
            key=lambda candidate: (candidate.complexity, -candidate.zipf, candidate.word),
        )
        selected[str(grade)] = take(
            [*by_grade[grade], *adjacent_pool],
            TARGETS[str(grade)],
            used,
        )

    advanced_pool = sorted(
        (
            candidate
            for candidate in candidates
            if candidate.source_grade >= 3 and len(candidate.word) >= 6 and candidate.word not in used
        ),
        key=lambda candidate: (candidate.complexity, candidate.word),
    )
    advanced_count = sum(TARGETS[str(grade)] for grade in range(7, 13))
    advanced = advanced_pool[-advanced_count:]
    if len(advanced) != advanced_count:
        raise RuntimeError(
            f"Needed {advanced_count} advanced candidates but found {len(advanced)}"
        )
    for grade in range(7, 13):
        count = TARGETS[str(grade)]
        selected[str(grade)] = take(advanced, count, used)

    return selected


def entry(candidate: Candidate, grade: str, index: int, count: int) -> dict[str, Any]:
    lower_boundary = math.floor(count * 0.2)
    upper_boundary = math.ceil(count * 0.8)
    difficulty = "easy" if index < lower_boundary else "hard" if index >= upper_boundary else "medium"
    result: dict[str, Any] = {
        "id": f"gw-{candidate.source_id}-{candidate.word}",
        "word": candidate.word,
        "gradeLevel": grade,
        "difficulty": difficulty,
        "definition": candidate.definition,
        "partOfSpeech": candidate.part_of_speech,
        "syllableCount": candidate.syllables,
        "spellingPatterns": candidate.patterns,
        "sourceId": SOURCE["id"],
    }
    if candidate.example:
        result["usageExample"] = candidate.example
    if candidate.phonetic:
        result["phonetic"] = candidate.phonetic
    return result


def write_curriculum(selected: dict[str, list[Candidate]], output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    for grade, candidates in selected.items():
        ordered = sorted(candidates, key=lambda candidate: (candidate.complexity, candidate.word))
        label = "Kindergarten" if grade == "K" else f"Grade {grade}"
        word_set = {
            "name": f"{label} Spelling Curriculum",
            "description": f"Grade-targeted spelling and vocabulary practice for {label}.",
            "version": "1.0.0",
            "language": "en-US",
            "gradeLevel": grade,
            "sources": [SOURCE],
            "words": [entry(candidate, grade, index, len(ordered)) for index, candidate in enumerate(ordered)],
        }
        filename = f"grade-{grade.lower()}.json"
        (output / filename).write_text(
            json.dumps(word_set, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("database", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    candidates = load_candidates(arguments.database)
    selected = select_curriculum(candidates)
    write_curriculum(selected, arguments.output)
    print(f"Wrote {sum(map(len, selected.values()))} words across {len(selected)} grades")


if __name__ == "__main__":
    main()
