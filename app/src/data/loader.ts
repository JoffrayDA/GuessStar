import { SoireeQuestion } from '../types';

import mangaQ from '../../../data/soiree/manga.json';
import sportQ from '../../../data/soiree/sport.json';
import cinemaQ from '../../../data/soiree/cinema.json';
import histoireQ from '../../../data/soiree/histoire.json';
import cuisineQ from '../../../data/soiree/cuisine.json';
import musiqueQ from '../../../data/soiree/musique.json';
import sciencesQ from '../../../data/soiree/sciences.json';
import geographieQ from '../../../data/soiree/geographie.json';

const QUESTIONS_BY_THEME: Record<string, SoireeQuestion[]> = {
  'Manga': mangaQ as SoireeQuestion[],
  'Sport': sportQ as SoireeQuestion[],
  'Cinéma': cinemaQ as SoireeQuestion[],
  'Histoire': histoireQ as SoireeQuestion[],
  'Cuisine': cuisineQ as SoireeQuestion[],
  'Musique': musiqueQ as SoireeQuestion[],
  'Sciences': sciencesQ as SoireeQuestion[],
  'Géographie': geographieQ as SoireeQuestion[],
};

export const ALL_THEMES = Object.keys(QUESTIONS_BY_THEME);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomThemes(count = 3): string[] {
  return shuffle(ALL_THEMES).slice(0, count);
}

export function getQuestionsForTheme(theme: string, count = 10): SoireeQuestion[] {
  const questions = QUESTIONS_BY_THEME[theme] ?? [];
  return shuffle(questions).slice(0, count);
}
