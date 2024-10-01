import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen'; // Tela inicial
import LoginScreen from './src/screens/LoginScreen';   // Tela de login
import HomeScreen from './src/screens/HomeScreen'; // Tela Home
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import TeamsScreen from './src/screens/TeamsScreen';
import MatchesScreen from './src/screens/MatchesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Players" component={PlayerScreen} />
        <Stack.Screen name="Teams" component={TeamsScreen} />
        <Stack.Screen name="Matches" component={MatchesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
