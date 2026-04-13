import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../theme/theme';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login } = useAuth();
  
  const handleGuestSignIn = async () => {
    try {
      const data = await authService.guestLogin();
      if (data.access_token) {
        login(data.access_token);
      }
    } catch (error) {
      console.error('Guest login failed', error);
      alert('Guest login failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    const platform = Platform.OS === 'web' ? 'web' : 'mobile';
    const url = authService.googleLoginTrigger(platform);

    if (Platform.OS === 'web') {
      // Open a popup for Google login on web (standard OAuth pattern)
      const popup = window.open(url, 'googleLogin', 'width=500,height=650,scrollbars=yes,resizable=yes');
      if (!popup) {
        alert('Popup blocked! Please allow popups for localhost:8081 and try again.');
      }
      // The postMessage listener in AuthContext will handle the response
    } else {
      // Deep link for mobile
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#171b3e', Colors.background]}
          style={styles.gradient}
        />
      </View>
      
      <View style={[styles.content, { zIndex: 1 }]}>
        <Text style={styles.heroIcon}>🧠</Text>
        
        <Text style={styles.title}>GenAI Masterclass</Text>
        <Text style={styles.description}>
          Master the future of technology.{'\n'}
          Learn Prompt Engineering, LLMs, RAG, and AI Agents.
        </Text>

        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }} 
            style={styles.googleLogo} 
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity 
          style={styles.guestButton} 
          onPress={handleGuestSignIn}
          activeOpacity={0.7}
        >
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 60,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0, 242, 254, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.greyText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Radius.pill,
    width: '100%',
    marginBottom: Spacing.md,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1F1F1F',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceHigh,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: Colors.greyText,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Radius.pill,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.surfaceBright,
  },
  guestIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  guestButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
});
