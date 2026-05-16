export interface SoireeItem {
  name: string;
  points: number;
}

export interface SoireeTrap {
  name: string;
  penalty: number;
}

export interface SoireeQuestion {
  id: string;
  theme: string;
  question: string;
  items: SoireeItem[];
  trap: SoireeTrap;
}

export type RootStackParamList = {
  Home: undefined;
  SoireeSetup: undefined;
  SoireeTransition: undefined;
  SoireeGame: undefined;
  SoireeScore: undefined;
};
