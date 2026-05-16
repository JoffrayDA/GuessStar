import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { getRandomThemes, getQuestionsForTheme } from '../data/loader';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SoireeTransition'> };

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

export default function SoireeTransitionScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();

  const playingTeam = state.teams[state.currentTeam];
  const readingTeam = state.teams[state.currentTeam === 0 ? 1 : 0];
  const theme = state.pendingTheme ?? '?';

  const handleStart = () => {
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

      <View style={s.card}>
        <Text style={s.themeIcon}>{THEME_ICONS[theme] ?? '❓'}</Text>
        <Text style={s.themeLabel}>THÈME</Text>
        <Text style={s.themeName}>{theme}</Text>
      </View>

      <View style={s.roles}>
        <View style={s.roleRow}>
          <Text style={s.roleIcon}>🎤</Text>
          <View>
            <Text style={s.roleLabel}>JOUE</Text>
            <Text style={s.roleName}>{playingTeam}</Text>
          </View>
        </View>
        <View style={s.roleRow}>
          <Text style={s.roleIcon}>📱</Text>
          <View>
            <Text style={s.roleLabel}>TIENT LE TÉLÉPHONE</Text>
            <Text style={s.roleName}>{readingTeam}</Text>
          </View>
        </View>
      </View>

      <Text style={s.hint}>
        {readingTeam} lit la question à voix haute et coche les réponses trouvées.
      </Text>

      <View style={s.spacer} />
      <TouchableOpacity style={s.btn} onPress={handleStart}>
        <Text style={s.btnText}>On joue ! →</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a', padding: 24, paddingTop: 52 },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 32,
  },
  scoreItem: { alignItems: 'center', flex: 1 },
  scoreName: { fontSize: 13, color: '#8892b0', fontWeight: '600' },
  activeTeam: { color: '#e94560' },
  scoreVal: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  scoreSep: { fontSize: 24, color: '#2a2a4a' },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e94560',
  },
  themeIcon: { fontSize: 56, marginBottom: 12 },
  themeLabel: { fontSize: 11, fontWeight: '700', color: '#8892b0', letterSpacing: 2, marginBottom: 4 },
  themeName: { fontSize: 30, fontWeight: '900', color: '#ffffff' },
  roles: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  roleIcon: { fontSize: 28, marginRight: 14 },
  roleLabel: { fontSize: 10, fontWeight: '700', color: '#8892b0', letterSpacing: 1 },
  roleName: { fontSize: 17, fontWeight: '700', color: '#ffffff', marginTop: 2 },
  hint: {
    fontSize: 13,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  spacer: { flex: 1 },
  btn: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
});
