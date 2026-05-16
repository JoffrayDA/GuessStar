import React, { createContext, useContext, useReducer } from 'react';
import { GamePlanItem } from '../data/loader';

interface GameState {
  teams: [string, string];
  scores: [number, number];
  gamePlan: GamePlanItem[];
  turnIndex: number;
}

type GameAction =
  | { type: 'START_GAME'; teams: [string, string]; gamePlan: GamePlanItem[] }
  | { type: 'ADD_POINTS'; points: number }
  | { type: 'NEXT_TURN' }
  | { type: 'RESET' };

const initialState: GameState = {
  teams: ['Équipe A', 'Équipe B'],
  scores: [0, 0],
  gamePlan: [],
  turnIndex: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, teams: action.teams, gamePlan: action.gamePlan };
    case 'ADD_POINTS': {
      const newScores: [number, number] = [state.scores[0], state.scores[1]];
      const team = state.gamePlan[state.turnIndex]?.team ?? 0;
      newScores[team] += action.points;
      return { ...state, scores: newScores };
    }
    case 'NEXT_TURN':
      return { ...state, turnIndex: state.turnIndex + 1 };
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
