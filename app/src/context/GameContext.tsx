import React, { createContext, useContext, useReducer } from 'react';
import { SoireeQuestion } from '../types';

interface GameState {
  teams: [string, string];
  scores: [number, number];
  currentTeam: 0 | 1;
  questions: SoireeQuestion[];
  questionIndex: number;
}

type GameAction =
  | { type: 'START_GAME'; teams: [string, string] }
  | { type: 'SET_QUESTIONS'; questions: SoireeQuestion[] }
  | { type: 'ADD_POINTS'; points: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SWITCH_TEAM' }
  | { type: 'RESET' };

const initialState: GameState = {
  teams: ['Équipe A', 'Équipe B'],
  scores: [0, 0],
  currentTeam: 0,
  questions: [],
  questionIndex: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, teams: action.teams };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.questions, questionIndex: 0 };
    case 'ADD_POINTS': {
      const newScores: [number, number] = [state.scores[0], state.scores[1]];
      newScores[state.currentTeam] += action.points;
      return { ...state, scores: newScores };
    }
    case 'NEXT_QUESTION':
      return { ...state, questionIndex: state.questionIndex + 1 };
    case 'SWITCH_TEAM':
      return { ...state, currentTeam: state.currentTeam === 0 ? 1 : 0, questionIndex: 0, questions: [] };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
