"""
GuessStar — Question Generator
Generates 1600 quiz questions via Google Gemini API (200 per theme, 8 themes).
Cost: GRATUIT avec le tier gratuit Gemini.

Usage:
  pip install google-genai
  export GOOGLE_API_KEY=AIza...
  python scripts/generate_questions.py
"""

import json
import os
import time
from pathlib import Path

from google import genai
from google.genai import types

THEMES = [
    "Manga",
    "Sport",
    "Cinéma",
    "Histoire",
    "Cuisine",
    "Musique",
    "Sciences",
    "Géographie",
]

QUESTIONS_PER_THEME = 200
BATCH_SIZE = 20
MODEL = "gemini-1.5-flash"
OUTPUT_DIR = Path("data/questions")


def build_prompt(theme: str, existing_questions: list[dict], batch_size: int) -> str:
    avoid_block = ""
    if existing_questions:
        sample = [q["question"] for q in existing_questions[-40:]]
        avoid_block = "\n\nÉVITE ces questions déjà générées :\n" + "\n".join(
            f"- {q}" for q in sample
        )

    return f"""Génère exactement {batch_size} questions de culture générale sur le thème "{theme}" pour une application de quiz mobile française.

Règles STRICTES :
- Toutes les questions et réponses en français
- Faits 100% vérifiés et précis (c'est un quiz, pas de place pour l'erreur)
- Questions variées : couvre différents aspects, personnages, dates, lieux, records
- Mauvaises réponses plausibles MAIS clairement incorrectes pour quelqu'un qui connaît le sujet
- Répartition : 8 faciles, 8 moyennes, 4 difficiles dans ce batch
- Questions courtes (max 20 mots), réponses courtes (max 5 mots de préférence)
{avoid_block}

Réponds UNIQUEMENT avec ce JSON valide (pas de texte avant ou après, pas de markdown) :
{{
  "questions": [
    {{
      "theme": "{theme}",
      "question": "Quelle est la question ?",
      "correct_answer": "Bonne réponse",
      "wrong_answers": ["Mauvaise 1", "Mauvaise 2", "Mauvaise 3"],
      "difficulty": "facile"
    }}
  ]
}}"""


def generate_batch(client: genai.Client, theme: str, existing: list[dict], batch_size: int) -> list[dict]:
    prompt = build_prompt(theme, existing, batch_size)

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.85,
            response_mime_type="application/json",
        ),
    )

    data = json.loads(response.text)
    return data.get("questions", [])


def slug(theme: str) -> str:
    replacements = {"é": "e", "è": "e", "ê": "e", "î": "i", "ô": "o", "ù": "u", "ç": "c", " ": "_"}
    result = theme.lower()
    for char, rep in replacements.items():
        result = result.replace(char, rep)
    return result


def main():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        api_key = input("Clé API Google (AIza...): ").strip()

    client = genai.Client(api_key=api_key)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for theme in THEMES:
        print(f"\n{'='*50}")
        print(f"  Thème : {theme}")
        print(f"{'='*50}")

        theme_file = OUTPUT_DIR / f"{slug(theme)}.json"
        theme_questions: list[dict] = []

        if theme_file.exists():
            with open(theme_file, "r", encoding="utf-8") as f:
                theme_questions = json.load(f)
            print(f"  Reprise : {len(theme_questions)} questions existantes")

        while len(theme_questions) < QUESTIONS_PER_THEME:
            remaining = QUESTIONS_PER_THEME - len(theme_questions)
            batch_size = min(BATCH_SIZE, remaining)

            try:
                batch = generate_batch(client, theme, theme_questions, batch_size)
                theme_questions.extend(batch)

                with open(theme_file, "w", encoding="utf-8") as f:
                    json.dump(theme_questions, f, ensure_ascii=False, indent=2)

                print(f"  ✓ {len(theme_questions)}/{QUESTIONS_PER_THEME} questions")
                time.sleep(1)  # Respect rate limits tier gratuit

            except Exception as e:
                print(f"  ⚠ Erreur : {e}")
                print("  Retry dans 15 secondes...")
                time.sleep(15)

        print(f"  ✅ {theme} terminé — {len(theme_questions)} questions")

    combined_file = OUTPUT_DIR / "all_questions.json"
    all_questions: list[dict] = []
    for theme in THEMES:
        theme_file = OUTPUT_DIR / f"{slug(theme)}.json"
        if theme_file.exists():
            with open(theme_file, "r", encoding="utf-8") as f:
                all_questions.extend(json.load(f))

    with open(combined_file, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"  TERMINÉ — {len(all_questions)} questions au total")
    print(f"  Fichiers dans : {OUTPUT_DIR.resolve()}")
    print(f"  Fichier combiné : {combined_file.resolve()}")
    print(f"  Coût : GRATUIT (Gemini free tier)")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
