import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import SoireeSetupScreen from './src/screens/SoireeSetupScreen';
import SoireeTransitionScreen from './src/screens/SoireeTransitionScreen';
import SoireeGameScreen from './src/screens/SoireeGameScreen';
import SoireeScoreScreen from './src/screens/SoireeScoreScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0d0d1a' } }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SoireeSetup" component={SoireeSetupScreen} />
            <Stack.Screen name="SoireeTransition" component={SoireeTransitionScreen} />
            <Stack.Screen name="SoireeGame" component={SoireeGameScreen} />
            <Stack.Screen name="SoireeScore" component={SoireeScoreScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </GestureHandlerRootView>
  );
}
