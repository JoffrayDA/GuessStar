import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SoireeSetup'> };

export default function SoireeSetupScreen({ navigation }: Props) {
  const { dispatch } = useGame();
  const [teamA, setTeamA] = useState('Équipe A');
  const [teamB, setTeamB] = useState('Équipe B');

  const handleStart = () => {
    const nameA = teamA.trim() || 'Équipe A';
    const nameB = teamB.trim() || 'Équipe B';
    dispatch({ type: 'START_GAME', teams: [nameA, nameB] });
    navigation.navigate('SoireeTheme');
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Mode Soirée</Text>
      <Text style={s.sub}>Nommez vos équipes</Text>

      <View style={s.form}>
        <View style={s.field}>
          <Text style={s.label}>ÉQUIPE 1</Text>
          <TextInput
            style={s.input}
            value={teamA}
            onChangeText={setTeamA}
            placeholder="Équipe A"
            placeholderTextColor="#4a4a6a"
            maxLength={20}
            selectTextOnFocus
          />
        </View>

        <Text style={s.vs}>VS</Text>

        <View style={s.field}>
          <Text style={s.label}>ÉQUIPE 2</Text>
          <TextInput
            style={s.input}
            value={teamB}
            onChangeText={setTeamB}
            placeholder="Équipe B"
            placeholderTextColor="#4a4a6a"
            maxLength={20}
            selectTextOnFocus
          />
        </View>
      </View>

      <View style={s.spacer} />
      <TouchableOpacity style={s.btn} onPress={handleStart}>
        <Text style={s.btnText}>C'est parti ! →</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a', padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', textAlign: 'center' },
  sub: { fontSize: 15, color: '#8892b0', textAlign: 'center', marginTop: 6, marginBottom: 40 },
  form: { gap: 8, alignItems: 'center' },
  field: { width: '100%' },
  label: { fontSize: 11, fontWeight: '700', color: '#8892b0', letterSpacing: 2, marginBottom: 8 },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
  },
  vs: { fontSize: 20, fontWeight: '900', color: '#e94560', marginVertical: 12 },
  spacer: { flex: 1 },
  btn: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
});
