import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Radius, Spacing } from '../theme/theme';
import { Trophy, TrendingUp, Clock } from 'lucide-react-native';

export default function QuizScreen() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState('0%');

  const options = [
    { id: 1, text: 'A) Asking the AI to think step-by-step.', correct: false },
    { id: 2, text: 'B) Providing demonstrations before the query.', correct: true },
    { id: 3, text: 'C) Fine-tuning the model weights.', correct: false },
  ];

  const handleOptionSelect = (id: number, correct: boolean) => {
    setSelectedOption(id);
    setAccuracy(correct ? '100%' : '0%');
  };

  const leaderboard = [
    { name: 'Sarah.ai', xp: '12,450 XP', rank: 1, pro: true, icon: '👩‍💻' },
    { name: 'ZenCoder', xp: '11,920 XP', rank: 2, pro: false, icon: '👨‍💻' },
    { name: 'You (Rank 42)', xp: '8,240 XP', rank: 42, pro: false, icon: '👨‍💼', active: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👨‍💼</Text>
        </View>
        <Text style={styles.headerTitle}>GenAI Masterclass</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>0 🔥</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.goldCaps}>CURRENT CHALLENGE</Text>
          <Text style={styles.displayTitle}>Prompt Engineering Mastery</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.overline}>TIME LEFT</Text>
            <View style={styles.statRow}>
              <Clock size={16} color={Colors.primary} />
              <Text style={styles.statValueMono}>04:52</Text>
            </View>
          </View>
          <View style={[styles.statCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.overline}>ACCURACY</Text>
            <Text style={styles.statValueLarge}>{accuracy}</Text>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '60%' }]} />
        </View>

        <View style={styles.quizCard}>
          <View style={styles.quizHeader}>
            <View style={[styles.pillLabel, { backgroundColor: '#5d5fef' }]}>
              <Text style={styles.pillText}>Q8 / 12</Text>
            </View>
            <Text style={styles.difficultyText}>Difficulty: Intermediate</Text>
          </View>
          
          <Text style={styles.questionText}>Which of the following best describes 'Few-Shot Prompting'?</Text>
          
          <View style={styles.codeSnippet}>
            <Text style={styles.codeText}># You provide the AI with 3 examples{"\n"}# before asking it to solve your problem.</Text>
          </View>

          <View style={styles.optionsStack}>
            {options.map((opt) => (
              <TouchableOpacity 
                key={opt.id}
                style={[
                  styles.option,
                  selectedOption === opt.id && styles.optionSelected,
                  selectedOption === opt.id && !opt.correct && styles.optionWrong
                ]}
                onPress={() => handleOptionSelect(opt.id, opt.correct)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{opt.text}</Text>
                <View style={[
                  styles.radio,
                  selectedOption === opt.id && (opt.correct ? styles.radioCorrect : styles.radioWrong)
                ]}>
                  {selectedOption === opt.id && (
                    <Text style={styles.radioIcon}>{opt.correct ? '✔️' : '❌'}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.leaderboardSection}>
          <View style={styles.sectionHeader}>
            <Trophy size={20} color={Colors.amber} />
            <Text style={styles.sectionTitle}>Top Performers</Text>
          </View>
          
          {leaderboard.map((item, index) => (
            <View key={index} style={[styles.rankRow, item.active && styles.rankRowActive]}>
              <Text style={styles.rankAvatar}>{item.icon}</Text>
              <View style={styles.rankInfo}>
                <View>
                  <Text style={styles.rankName}>
                    {item.name} {item.pro && <Text style={styles.proTag}>PRO</Text>}
                  </Text>
                  <Text style={styles.rankXP}>{item.xp}</Text>
                </View>
                {item.rank <= 2 && (
                  <View style={[styles.badge, item.rank === 1 ? styles.badgeGold : styles.badgeSilver]}>
                    <Text style={styles.badgeText}>{item.rank}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  streakBadge: {
    backgroundColor: Colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
  },
  streakText: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  goldCaps: {
    color: Colors.amber,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  displayTitle: {
    fontSize: 22,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statCol: {
    flex: 1,
  },
  overline: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.greyText,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValueMono: {
    fontSize: 20,
    fontFamily: 'JetBrainsMono_700Bold',
    color: Colors.primary,
  },
  statValueLarge: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 3,
    marginBottom: Spacing.xl,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  quizCard: {
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  pillLabel: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.pill,
  },
  pillText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  difficultyText: {
    fontSize: 12,
    color: Colors.greyText,
    fontStyle: 'italic',
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  codeSnippet: {
    backgroundColor: Colors.codeBg,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  codeText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: Colors.greyText,
    lineHeight: 18,
  },
  optionsStack: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.surfaceHigh,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  optionWrong: {
    borderColor: Colors.error,
  },
  optionText: {
    fontSize: 14,
    color: Colors.white,
    flex: 1,
    paddingRight: 10,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCorrect: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioWrong: {
    borderColor: Colors.error,
    backgroundColor: Colors.error,
  },
  radioIcon: {
    fontSize: 10,
    color: Colors.background,
  },
  leaderboardSection: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: 8,
    gap: 12,
  },
  rankRowActive: {
    backgroundColor: Colors.surfaceHigh,
    borderWidth: 1,
    borderColor: Colors.surfaceBright,
  },
  rankAvatar: {
    fontSize: 24,
  },
  rankInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankName: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  rankXP: {
    color: Colors.greyText,
    fontSize: 12,
  },
  proTag: {
    color: Colors.primary,
    fontSize: 10,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGold: {
    backgroundColor: Colors.amber,
  },
  badgeSilver: {
    backgroundColor: '#cbd5e1',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});
