import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Home'> };

export default function HomeScreen({ navigation }: Props) {
  const { dispatch } = useGame();

  const handleSoiree = () => {
    dispatch({ type: 'RESET' });
    navigation.navigate('SoireeSetup');
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.star}>★</Text>
        <Text style={s.title}>GuessStar</Text>
        <Text style={s.sub}>Le quiz qui fait le buzz</Text>
      </View>

      <View style={s.modes}>
        <TouchableOpacity style={s.modeCard} onPress={handleSoiree}>
          <Text style={s.modeIcon}>🎉</Text>
          <Text style={s.modeName}>Mode Soirée</Text>
          <Text style={s.modeDesc}>2 équipes • Questions en liste • Ambiance chaos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.modeCard, s.disabled]}>
          <Text style={s.modeIcon}>⚔️</Text>
          <Text style={[s.modeName, s.disabledText]}>Mode Duel</Text>
          <Text style={s.modeDesc}>Bientôt disponible</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.modeCard, s.disabled]}>
          <Text style={s.modeIcon}>🧠</Text>
          <Text style={[s.modeName, s.disabledText]}>Mode Solo</Text>
          <Text style={s.modeDesc}>Bientôt disponible</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a', padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 48 },
  star: { fontSize: 48, color: '#f5a623' },
  title: { fontSize: 40, fontWeight: '900', color: '#ffffff', letterSpacing: 2 },
  sub: { fontSize: 14, color: '#8892b0', marginTop: 4 },
  modes: { gap: 16 },
  modeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  disabled: { opacity: 0.4 },
  modeIcon: { fontSize: 28, marginBottom: 8 },
  modeName: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  disabledText: { color: '#8892b0' },
  modeDesc: { fontSize: 13, color: '#8892b0' },
});
