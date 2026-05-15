import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SoireeScore'> };

export default function SoireeScoreScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();
  const [s0, s1] = state.scores;
  const [t0, t1] = state.teams;

  const tie = s0 === s1;
  const winner = s0 > s1 ? t0 : t1;
  const winnerScore = Math.max(s0, s1);
  const loserScore = Math.min(s0, s1);

  const handleReplay = () => {
    dispatch({ type: 'RESET' });
    navigation.navigate('Home');
  };

  return (
    <View style={s.container}>
      <Text style={s.trophy}>{tie ? '🤝' : '🏆'}</Text>

      <Text style={s.resultLabel}>{tie ? "Égalité !" : "Victoire !"}</Text>

      {!tie && (
        <Text style={s.winner}>{winner}</Text>
      )}

      <View style={s.scores}>
        <View style={[s.scoreCard, s0 > s1 && s.winnerCard]}>
          <Text style={s.teamName}>{t0}</Text>
          <Text style={s.scoreNum}>{s0}</Text>
          <Text style={s.scorePts}>points</Text>
          {s0 > s1 && <Text style={s.crown}>👑</Text>}
        </View>

        <View style={[s.scoreCard, s1 > s0 && s.winnerCard]}>
          <Text style={s.teamName}>{t1}</Text>
          <Text style={s.scoreNum}>{s1}</Text>
          <Text style={s.scorePts}>points</Text>
          {s1 > s0 && <Text style={s.crown}>👑</Text>}
        </View>
      </View>

      {!tie && (
        <Text style={s.diff}>
          Écart : {Math.abs(s0 - s1)} points
        </Text>
      )}

      <TouchableOpacity style={s.btn} onPress={handleReplay}>
        <Text style={s.btnText}>Rejouer</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0d0d1a',
    alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  trophy: { fontSize: 72, marginBottom: 12 },
  resultLabel: { fontSize: 16, fontWeight: '600', color: '#8892b0', letterSpacing: 2, marginBottom: 4 },
  winner: { fontSize: 32, fontWeight: '900', color: '#f5a623', marginBottom: 32 },
  scores: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  scoreCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  winnerCard: { borderColor: '#f5a623', borderWidth: 2 },
  teamName: { fontSize: 14, fontWeight: '600', color: '#8892b0', marginBottom: 8 },
  scoreNum: { fontSize: 48, fontWeight: '900', color: '#ffffff' },
  scorePts: { fontSize: 13, color: '#8892b0' },
  crown: { fontSize: 24, marginTop: 8 },
  diff: { fontSize: 14, color: '#8892b0', marginBottom: 40 },
  btn: {
    backgroundColor: '#e94560', borderRadius: 14,
    paddingHorizontal: 40, paddingVertical: 16,
  },
  btnText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
});
