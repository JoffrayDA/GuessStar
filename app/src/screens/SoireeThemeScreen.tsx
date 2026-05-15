import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { getRandomThemes, getQuestionsForTheme } from '../data/loader';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SoireeTheme'> };

const THEME_ICONS: Record<string, string> = {
  'Manga': '⛩️',
  'Sport': '🏆',
  'Cinéma': '🎬',
  'Histoire': '📜',
  'Cuisine': '🍳',
  'Musique': '🎵',
  'Sciences': '🔬',
  'Géographie': '🌍',
};

export default function SoireeThemeScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();
  const [themes] = useState(() => getRandomThemes(3));
  const teamName = state.teams[state.currentTeam];

  const handleSelect = (theme: string) => {
    const questions = getQuestionsForTheme(theme, 10);
    dispatch({ type: 'SET_QUESTIONS', questions });
    navigation.navigate('SoireeGame');
  };

  return (
    <View style={s.container}>
      <View style={s.scoreboard}>
        <View style={s.scoreItem}>
          <Text style={[s.scoreName, state.currentTeam === 0 && s.activeTeam]}>{state.teams[0]}</Text>
          <Text style={s.scoreVal}>{state.scores[0]} pts</Text>
        </View>
        <Text style={s.scoreSep}>·</Text>
        <View style={s.scoreItem}>
          <Text style={[s.scoreName, state.currentTeam === 1 && s.activeTeam]}>{state.teams[1]}</Text>
          <Text style={s.scoreVal}>{state.scores[1]} pts</Text>
        </View>
      </View>

      <Text style={s.prompt}>
        <Text style={s.highlight}>{teamName}</Text>
        {'\n'}choisissez votre thème
      </Text>

      <View style={s.cards}>
        {themes.map((theme) => (
          <TouchableOpacity key={theme} style={s.card} onPress={() => handleSelect(theme)}>
            <Text style={s.cardIcon}>{THEME_ICONS[theme] ?? '❓'}</Text>
            <Text style={s.cardName}>{theme}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a', padding: 24, paddingTop: 60 },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 40,
  },
  scoreItem: { alignItems: 'center' },
  scoreName: { fontSize: 13, color: '#8892b0', fontWeight: '600' },
  activeTeam: { color: '#e94560' },
  scoreVal: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  scoreSep: { fontSize: 24, color: '#2a2a4a' },
  prompt: { fontSize: 22, fontWeight: '700', color: '#ffffff', textAlign: 'center', lineHeight: 32, marginBottom: 40 },
  highlight: { color: '#e94560' },
  cards: { gap: 16 },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cardIcon: { fontSize: 40, marginBottom: 10 },
  cardName: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
});
