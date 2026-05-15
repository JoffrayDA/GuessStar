import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import SoireeSetupScreen from './src/screens/SoireeSetupScreen';
import SoireeThemeScreen from './src/screens/SoireeThemeScreen';
import SoireeGameScreen from './src/screens/SoireeGameScreen';
import SoireeScoreScreen from './src/screens/SoireeScoreScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SoireeSetup" component={SoireeSetupScreen} />
          <Stack.Screen name="SoireeTheme" component={SoireeThemeScreen} />
          <Stack.Screen name="SoireeGame" component={SoireeGameScreen} />
          <Stack.Screen name="SoireeScore" component={SoireeScoreScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
