import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EditorScreen from './src/screens/EditorScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import QuizScreen from './src/screens/QuizScreen';
import TheoryScreen from './src/screens/TheoryScreen';
import TheoryDetailScreen from './src/screens/TheoryDetailScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Editor" component={EditorScreen} />
          <Stack.Screen name="Journey" component={JourneyScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Theory" component={TheoryScreen} />
          <Stack.Screen name="TheoryDetail" component={TheoryDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
