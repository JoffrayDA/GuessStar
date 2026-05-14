---
stepsCompleted: [1]
inputDocuments: []
session_topic: 'GuessStar — application de culture générale mobile-first'
session_goals: 'Définir les features V1 livrables en quelques jours, mécaniques de jeu solides, contenu scrapé'
selected_approach: 'AI-Recommended + facilitation conversationnelle Mary'
techniques_used: []
ideas_generated: []
context_file: ''
---

# Brainstorming Session — GuessStar

**Facilitateur:** LeJox
**Date:** 2026-05-13

---

## Session Overview

**Topic:** GuessStar — application de culture générale mobile-first inspirée du Grand Concours
**Goals:** Définir V1 fonctionnelle livrable rapidement, mécaniques de jeu validées, pipeline contenu

---

## Décisions Verrouillées

### Modes de jeu
- **3 modes :** Soirée / Duel / Solo

### Mode Soirée
- 2 équipes en alternance
- L'équipe adverse lit les questions à voix haute (mécanique sociale, pas de TTS)
- 10 questions par round, 50 secondes chrono
- Mauvaise réponse → retour à zéro (drama garanti)
- Chaque bonne réponse = +1 point, objectif = 10 points
- Chaque équipe choisit son thème parmi 3 proposés

### Mode Duel
- Chaque joueur choisit SON propre thème (joue sur son territoire)
- V1 : différé (async) — pas temps réel
- Score partageable après la partie

### Mode Solo
- Pick thème → questions → score → historique
- Streak V2

### Thèmes V1 (8 grands thèmes)
1. Manga
2. Sport
3. Cinéma
4. Histoire
5. Cuisine
6. Musique
7. Sciences
8. Géographie

### Différenciateur clé
Mécanique "joue sur ton territoire" — tu choisis le thème sur lequel tu seras questionné.
Crée un enjeu identitaire fort vs quiz random classiques.

---

## Brainstorming Features V1

*(en cours)*
