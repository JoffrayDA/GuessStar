import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'SoireeGame'> };

const TIMER_DURATION = 50;

export default function SoireeGameScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();

  const current = state.gamePlan[state.turnIndex];
  const question = current?.question;
  const isLastTurn = state.turnIndex >= state.gamePlan.length - 1;

  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [pariItems, setPariItems] = useState<Set<number>>(new Set());
  const [roundScore, setRoundScore] = useState(0);
  const [trapTriggered, setTrapTriggered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerDone, setTimerDone] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCheckedItems(new Set());
    setPariItems(new Set());
    setRoundScore(0);
    setTrapTriggered(false);
    setTimeLeft(TIMER_DURATION);
    setTimerDone(false);
  }, [state.turnIndex]);

  useEffect(() => {
    if (timerDone) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerDone]);

  if (!current || !question) return null;

  const playingTeam = state.teams[current.team];

  const togglePari = (idx: number) => {
    if (checkedItems.has(idx)) return;
    setPariItems(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const checkItem = (idx: number) => {
    if (checkedItems.has(idx) || timerDone) return;
    const item = question.items[idx];
    const gained = pariItems.has(idx) ? item.points * 2 : item.points;
    setCheckedItems(prev => new Set(prev).add(idx));
    setRoundScore(prev => prev + gained);
  };

  const triggerTrap = () => {
    if (trapTriggered || timerDone) return;
    setTrapTriggered(true);
    setRoundScore(prev => prev - question.trap.penalty);
  };

  const handleNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    dispatch({ type: 'ADD_POINTS', points: roundScore });
    dispatch({ type: 'NEXT_TURN' });
    if (isLastTurn) {
      navigation.navigate('SoireeScore');
    } else {
      navigation.navigate('SoireeTransition');
    }
  };

  const timerColor = timeLeft > 20 ? '#4ade80' : timeLeft > 10 ? '#fbbf24' : '#ef4444';
  const turnNum = state.turnIndex + 1;
  const totalTurns = state.gamePlan.length;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.teamLabel}>{playingTeam} joue</Text>
          <Text style={s.qCounter}>Q {turnNum} / {totalTurns}</Text>
        </View>
        <View style={s.timerBox}>
          <Text style={[s.timerVal, { color: timerColor }]}>{timeLeft}</Text>
          <Text style={s.timerSec}>sec</Text>
        </View>
      </View>

      {timerDone && (
        <View style={s.timesUp}>
          <Text style={s.timesUpText}>⏱ Temps écoulé !</Text>
        </View>
      )}

      <View style={s.questionBox}>
        <Text style={s.questionText}>{question.question}</Text>
      </View>

      <ScrollView style={s.itemsList} showsVerticalScrollIndicator={false}>
        {question.items.map((item, idx) => {
          const checked = checkedItems.has(idx);
          const hasPari = pariItems.has(idx);
          return (
            <View key={idx} style={[s.itemRow, checked && s.itemChecked, hasPari && !checked && s.itemPari]}>
              <TouchableOpacity
                style={s.itemMain}
                onPress={() => checkItem(idx)}
                disabled={checked || timerDone}
              >
                <Text style={[s.itemCheck, checked && s.itemCheckDone]}>{checked ? '✓' : '○'}</Text>
                <Text style={[s.itemName, checked && s.itemNameDone]}>{item.name}</Text>
                <Text style={s.itemPts}>
                  {hasPari && !checked ? `×2 = ${item.points * 2}pt` : `${item.points}pt`}
                </Text>
              </TouchableOpacity>
              {!checked && !timerDone && (
                <TouchableOpacity
                  style={[s.pariBtn, hasPari && s.pariBtnActive]}
                  onPress={() => togglePari(idx)}
                >
                  <Text style={[s.pariBtnText, hasPari && s.pariBtnTextActive]}>×2</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <TouchableOpacity
          style={[s.trapRow, trapTriggered && s.trapTriggered]}
          onPress={triggerTrap}
          disabled={trapTriggered || timerDone}
        >
          <Text style={s.trapIcon}>{trapTriggered ? '💀' : '🪤'}</Text>
          <View>
            <Text style={s.trapLabel}>PIÈGE</Text>
            <Text style={s.trapName}>{question.trap.name}</Text>
          </View>
          <View style={s.trapPenaltyWrap}>
            <Text style={s.trapPenalty}>-{question.trap.penalty}pts</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={s.footer}>
        <View style={s.roundScore}>
          <Text style={s.roundScoreLabel}>Ce tour</Text>
          <Text style={[s.roundScoreVal, roundScore < 0 && s.roundScoreNeg]}>
            {roundScore >= 0 ? '+' : ''}{roundScore} pts
          </Text>
        </View>
        <TouchableOpacity
          style={[s.nextBtn, !timerDone && s.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!timerDone}
        >
          <Text style={s.nextBtnText}>
            {isLastTurn ? 'Fin →' : 'Suivante →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 52,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  teamLabel: { fontSize: 16, fontWeight: '700', color: '#e94560' },
  qCounter: { fontSize: 12, color: '#8892b0', marginTop: 2 },
  timerBox: { alignItems: 'center' },
  timerVal: { fontSize: 36, fontWeight: '900' },
  timerSec: { fontSize: 11, color: '#8892b0', marginTop: -4 },
  timesUp: {
    backgroundColor: '#2a0a0a',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ef4444',
  },
  timesUpText: { color: '#ef4444', fontWeight: '700', fontSize: 14 },
  questionBox: {
    backgroundColor: '#1a1a2e',
    margin: 12,
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  questionText: { fontSize: 17, fontWeight: '600', color: '#ffffff', lineHeight: 26 },
  itemsList: { flex: 1, paddingHorizontal: 12 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  itemChecked: { opacity: 0.45, borderColor: '#4ade80' },
  itemPari: { borderColor: '#f5a623', borderWidth: 2 },
  itemMain: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14 },
  itemCheck: { fontSize: 18, color: '#4a4a6a', width: 24, marginRight: 12 },
  itemCheckDone: { color: '#4ade80' },
  itemName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#ffffff' },
  itemNameDone: { color: '#6a8f6a', textDecorationLine: 'line-through' },
  itemPts: { fontSize: 13, fontWeight: '700', color: '#f5a623' },
  pariBtn: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: '#252550',
    borderLeftWidth: 1,
    borderLeftColor: '#2a2a4a',
  },
  pariBtnActive: { backgroundColor: '#3a2a00' },
  pariBtnText: { fontSize: 13, fontWeight: '800', color: '#8892b0' },
  pariBtnTextActive: { color: '#f5a623' },
  trapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4a1a2a',
  },
  trapTriggered: { opacity: 0.5, borderColor: '#ef4444' },
  trapIcon: { fontSize: 22, marginRight: 12 },
  trapLabel: { fontSize: 10, fontWeight: '700', color: '#ef4444', letterSpacing: 1 },
  trapName: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  trapPenaltyWrap: { flex: 1, alignItems: 'flex-end' },
  trapPenalty: { fontSize: 15, fontWeight: '800', color: '#ef4444' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
  },
  roundScore: { flex: 1 },
  roundScoreLabel: { fontSize: 11, color: '#8892b0' },
  roundScoreVal: { fontSize: 24, fontWeight: '900', color: '#4ade80' },
  roundScoreNeg: { color: '#ef4444' },
  nextBtn: { backgroundColor: '#e94560', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14 },
  nextBtnDisabled: { backgroundColor: '#4a1a2a' },
  nextBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
});
