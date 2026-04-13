import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../theme/theme';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarPlaceholder}>👨‍💼</Text>
          </View>
          <View>
            <Text style={styles.userName}>GenAI Masterclass</Text>
            <Text style={styles.userEmail}>guest@genai.local</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={16} color={Colors.amber} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={styles.card}>
          <Text style={styles.overline}>CURRENT PROGRESS</Text>
          <View style={styles.progressRow}>
            <Text style={styles.largeNumber}>0%</Text>
            <Text style={styles.masteryText}>Mastery</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '0%' }]} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              "Welcome to GenAI Masterclass! Start your very first lesson to begin your mastery journey."
            </Text>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.card}>
          <Text style={[styles.streakTitle, { color: Colors.amber }]}>0 Day Streak!</Text>
          <Text style={styles.streakSub}>Next milestone: 3 days</Text>
          <View style={styles.streakGrid}>
            {['M', 'T', 'W', 'T', 'F', 'S', '🏃'].map((day, i) => (
              <View 
                key={i} 
                style={[
                  styles.dayCircle, 
                  i === 6 ? styles.dayCurrent : styles.dayPast
                ]}
              >
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Next Lesson Card */}
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.pillLabel}>
            <Text style={styles.pillText}>NEXT LESSON</Text>
          </View>
          <Text style={styles.lessonHeading}>Foundations of AI</Text>
          <Text style={styles.lessonBody}>Start your very first module and learn the foundational blocks of Artificial Intelligence.</Text>
          <View style={styles.lessonMeta}>
            <Text style={styles.metaText}>🕒 5 mins  •  ⭐ Beginner</Text>
          </View>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Practice')}
          >
            <Text style={styles.primaryBtnText}>Start Session ▸</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Pro Tip */}
        <View style={styles.proTipCard}>
          <View style={styles.proTipBorder} />
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipBody}>
            Use <Text style={styles.codeText}>enumerate()</Text> when you need both the index and value in a loop.
          </Text>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Gradients = {
  primary: ['#00f2fe', '#4facfe'] as const,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceBright,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  avatarPlaceholder: {
    fontSize: 20,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
  },
  userEmail: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.greyText,
    fontStyle: 'italic',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  logoutText: {
    color: Colors.amber,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  overline: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.greyText,
    letterSpacing: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: Spacing.sm,
  },
  largeNumber: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },
  masteryText: {
    fontSize: 16,
    color: Colors.greyText,
    paddingBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 3,
    marginBottom: Spacing.lg,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  quoteBox: {
    backgroundColor: Colors.surfaceHigh,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  quoteText: {
    fontSize: 13,
    color: Colors.greyText,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  streakTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  streakSub: {
    fontSize: 12,
    color: Colors.greyText,
    marginBottom: Spacing.md,
  },
  streakGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPast: {
    backgroundColor: Colors.surfaceHigh,
  },
  dayCurrent: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
  heroCard: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  pillLabel: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pillText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  lessonHeading: {
    fontSize: 22,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
    marginBottom: 8,
  },
  lessonBody: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  lessonMeta: {
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },
  primaryBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.background,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  proTipCard: {
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  proTipBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.amber,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.amber,
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 13,
    color: Colors.greyText,
    lineHeight: 18,
  },
  codeText: {
    fontFamily: 'JetBrainsMono_400Regular',
    color: Colors.white,
    backgroundColor: Colors.surfaceHigh,
  },
});
