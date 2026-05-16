import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'SoireeTransition'> };

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
  const { state } = useGame();

  const current = state.gamePlan[state.turnIndex];
  if (!current) return null;

  const playingTeam = state.teams[current.team];
  const readingTeam = state.teams[current.team === 0 ? 1 : 0];
  const theme = current.theme;
  const turnNum = state.turnIndex + 1;
  const totalTurns = state.gamePlan.length;

  return (
    <View style={s.container}>
      <View style={s.scoreboard}>
        <View style={s.scoreItem}>
          <Text style={[s.scoreName, current.team === 0 && s.activeTeam]}>{state.teams[0]}</Text>
          <Text style={s.scoreVal}>{state.scores[0]} pts</Text>
        </View>
        <Text style={s.scoreSep}>·</Text>
        <View style={s.scoreItem}>
          <Text style={[s.scoreName, current.team === 1 && s.activeTeam]}>{state.teams[1]}</Text>
          <Text style={s.scoreVal}>{state.scores[1]} pts</Text>
        </View>
      </View>

      <Text style={s.counter}>Question {turnNum} / {totalTurns}</Text>

      <View style={s.themeCard}>
        <Text style={s.themeIcon}>{THEME_ICONS[theme] ?? '❓'}</Text>
        <Text style={s.themeLabel}>THÈME</Text>
        <Text style={s.themeName}>{theme}</Text>
      </View>

      <View style={s.roles}>
        <View style={s.roleRow}>
          <Text style={s.roleEmoji}>🎤</Text>
          <View>
            <Text style={s.roleLabel}>JOUE</Text>
            <Text style={s.roleName}>{playingTeam}</Text>
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.roleRow}>
          <Text style={s.roleEmoji}>📱</Text>
          <View>
            <Text style={s.roleLabel}>TIENT LE TÉLÉPHONE</Text>
            <Text style={s.roleName}>{readingTeam}</Text>
          </View>
        </View>
      </View>

      <Text style={s.hint}>{readingTeam} lit la question et coche les réponses. 50 secondes !</Text>

      <View style={s.spacer} />
      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('SoireeGame')}>
        <Text style={s.btnText}>Prêts ? →</Text>
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
    marginBottom: 12,
  },
  scoreItem: { alignItems: 'center', flex: 1 },
  scoreName: { fontSize: 13, color: '#8892b0', fontWeight: '600' },
  activeTeam: { color: '#e94560' },
  scoreVal: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  scoreSep: { fontSize: 24, color: '#2a2a4a' },
  counter: { textAlign: 'center', fontSize: 12, color: '#8892b0', marginBottom: 20 },
  themeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e94560',
  },
  themeIcon: { fontSize: 52, marginBottom: 10 },
  themeLabel: { fontSize: 11, fontWeight: '700', color: '#8892b0', letterSpacing: 2, marginBottom: 4 },
  themeName: { fontSize: 28, fontWeight: '900', color: '#ffffff' },
  roles: { backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16, marginBottom: 12 },
  roleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  roleEmoji: { fontSize: 26, marginRight: 14 },
  roleLabel: { fontSize: 10, fontWeight: '700', color: '#8892b0', letterSpacing: 1 },
  roleName: { fontSize: 17, fontWeight: '700', color: '#ffffff', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#2a2a4a' },
  hint: { fontSize: 13, color: '#8892b0', textAlign: 'center', lineHeight: 20 },
  spacer: { flex: 1 },
  btn: { backgroundColor: '#e94560', borderRadius: 14, padding: 18, alignItems: 'center' },
  btnText: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
});
