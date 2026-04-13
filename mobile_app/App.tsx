import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Home, Code, Map, Target, BookOpen } from 'lucide-react-native';
import * as SplashScreen from 'expo-splash-screen';

import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { 
  Manrope_600SemiBold, 
  Manrope_800ExtraBold 
} from '@expo-google-fonts/manrope';
import { 
  JetBrainsMono_400Regular, 
  JetBrainsMono_700Bold 
} from '@expo-google-fonts/jetbrains-mono';

import { Colors } from './src/theme/theme';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EditorScreen from './src/screens/EditorScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import QuizScreen from './src/screens/QuizScreen';
import TheoryScreen from './src/screens/TheoryScreen';
import TheoryDetailScreen from './src/screens/TheoryDetailScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#080c14',
          borderTopColor: Colors.surfaceHigh,
          paddingBottom: 20,
          paddingTop: 10,
          height: 84,
        },
        tabBarActiveTintColor: '#c0c1ff',
        tabBarInactiveTintColor: Colors.greyText,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home size={size} color={color} />;
          if (route.name === 'Practice') return <Code size={size} color={color} />;
          if (route.name === 'Theory') return <BookOpen size={size} color={color} />;
          if (route.name === 'Quizzes') return <Target size={size} color={color} />;
          if (route.name === 'Projects') return <Map size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Theory" component={TheoryScreen} />
      <Tab.Screen name="Practice" component={EditorScreen} />
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Quizzes" component={QuizScreen} />
      <Tab.Screen name="Projects" component={JourneyScreen} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="TheoryDetail" 
            component={TheoryDetailScreen}
            options={{ 
              headerShown: true, 
              headerTitle: 'Module Details',
              headerStyle: { backgroundColor: Colors.background },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontFamily: 'Manrope_800ExtraBold' }
            }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Manrope_600SemiBold,
    Manrope_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
