import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Radius, Spacing } from '../theme/theme';
import { TrendingUp, Lock, Play, ChevronRight } from 'lucide-react-native';

export default function JourneyScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice Journey</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.summaryText}>
          Master Generative AI fundamentals through interactive challenges. Each step unlocks new professional capabilities.
        </Text>

        <View style={styles.statsCard}>
          <Text style={styles.overline}>GLOBAL PROGRESS</Text>
          <View style={styles.statsFlex}>
            <Text style={styles.largeNumber}>0 %</Text>
            <TrendingUp size={24} color={Colors.primary} />
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '0%' }]} />
          </View>
        </View>

        <View style={styles.skillMap}>
          <View style={styles.node}>
            <View style={[styles.iconWrap, styles.nodeCurrent]}>
              <Text style={styles.nodeIcon}>{'>_'}</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.node}>
            <View style={[styles.iconWrap, styles.nodeLocked]}>
              <Lock size={20} color={Colors.greyText} />
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.node}>
            <View style={[styles.iconWrap, styles.nodeLocked]}>
              <Lock size={20} color={Colors.greyText} />
            </View>
          </View>
        </View>

        <View style={styles.moduleCard}>
          <Text style={styles.moduleCardTitle}>Current Module</Text>
          <View style={styles.moduleList}>
            <TouchableOpacity 
              style={styles.moduleItem} 
              onPress={() => navigation.navigate('Theory')}
            >
              <Play size={16} color={Colors.primary} fill={Colors.primary} />
              <Text style={[styles.moduleItemText, styles.activeItem]}>Foundations of AI</Text>
            </TouchableOpacity>
            <View style={styles.moduleItem}>
              <Lock size={16} color={Colors.greyText} />
              <Text style={styles.moduleItemText}>Basic Syntax</Text>
            </View>
            <View style={styles.moduleItem}>
              <Lock size={16} color={Colors.greyText} />
              <Text style={styles.moduleItemText}>Variables</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.sandboxCard}
          onPress={() => navigation.navigate('Practice')}
        >
          <View style={styles.sandboxContent}>
            <Text style={styles.sandboxTitle}>Live Coding Sandbox</Text>
            <Text style={styles.sandboxSub}>New exercises are generated every 24 hours based on your learning curve.</Text>
            <Text style={styles.sandboxBtnText}>Launch IDE ➔</Text>
          </View>
        </TouchableOpacity>

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
    padding: Spacing.lg,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.greyText,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  statsCard: {
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  overline: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.greyText,
    letterSpacing: 1,
    marginBottom: 8,
  },
  statsFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  largeNumber: {
    fontSize: 32,
    fontFamily: 'Inter_800ExtraBold',
    color: Colors.white,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  skillMap: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  node: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconWrap: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCurrent: {
    borderColor: Colors.accentPurple,
    shadowColor: Colors.accentPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  nodeLocked: {
    borderColor: Colors.surfaceHigh,
  },
  nodeIcon: {
    color: Colors.white,
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 18,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: Colors.surfaceHigh,
    marginVertical: -2,
    zIndex: 1,
  },
  moduleCard: {
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  moduleCardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 12,
  },
  moduleList: {
    gap: 12,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceHigh,
    gap: 12,
  },
  moduleItemText: {
    fontSize: 15,
    color: Colors.greyText,
    fontFamily: 'Inter_400Regular',
  },
  activeItem: {
    color: Colors.accentPurple,
    fontFamily: 'Inter_600SemiBold',
  },
  sandboxCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBright,
  },
  sandboxTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 8,
  },
  sandboxSub: {
    fontSize: 12,
    color: Colors.greyText,
    lineHeight: 18,
    marginBottom: 12,
  },
  sandboxBtnText: {
    color: Colors.primary,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
});
