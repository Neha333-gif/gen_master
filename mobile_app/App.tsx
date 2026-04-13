import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
// import your other screens...

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  // ✅ THIS is what triggers the redirect — whenever isAuthenticated
  // flips to true, React re-renders and shows Dashboard instead of Auth
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // ── Authenticated screens ──
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          {/* Add EditorScreen, JourneyScreen, QuizScreen, etc. here */}
        </>
      ) : (
        // ── Unauthenticated screens ──
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
