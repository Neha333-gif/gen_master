import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Radius, Spacing } from '../theme/theme';
import { TheoryModule, TheorySection } from '../services/modulesData';
import { ChevronDown, ChevronUp, Lightbulb, Sparkles, BookOpen, Code } from 'lucide-react-native';

export default function TheoryDetailScreen({ route, navigation }: any) {
  const { module }: { module: TheoryModule } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>🎓 THEORY MODULE</Text>
          </View>
          <Text style={styles.title}>{module.id}. {module.title}</Text>
          <Text style={styles.overview}>{module.overview}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tagPillSmall}>
            <Text style={styles.tagTextSmall}>{module.tag}</Text>
          </View>
          <View style={styles.sectionHeader}>
            <Lightbulb size={20} color={Colors.amber} />
            <Text style={styles.sectionTitle}>Concept Explanation</Text>
          </View>
          <Text style={styles.explanationText}>{module.explanation}</Text>
          
          {module.code ? (
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{module.code}</Text>
            </View>
          ) : null}
        </View>

        {module.sections?.map((section, index) => (
          <Accordion key={index} section={section} />
        ))}

        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: Colors.accentPurple }]}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color={Colors.accentPurple} />
            <Text style={styles.sectionTitle}>Visualization</Text>
          </View>
          <Text style={[styles.explanationText, { fontStyle: 'italic' }]}>{module.visual}</Text>
        </View>

        <View style={styles.sandboxCard}>
          <Text style={styles.sandboxTitle}>🏋️ Practice Challenge</Text>
          <Text style={styles.sandboxText}>Ready to apply what you've learned?</Text>
          <TouchableOpacity 
            style={styles.sandboxBtn}
            onPress={() => navigation.navigate('Practice')}
          >
            <Text style={styles.sandboxBtnText}>Launch Code Sandbox ▸</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Accordion({ section }: { section: TheorySection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeader}>
          <BookOpen size={18} color={Colors.primary} />
          <Text style={styles.accordionTitle}>{section.subtitle}</Text>
        </View>
        {isOpen ? <ChevronUp size={20} color={Colors.greyText} /> : <ChevronDown size={20} color={Colors.greyText} />}
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.accordionContent}>
          <Text style={styles.explanationText}>{section.body}</Text>
          {section.code ? (
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{section.code}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tagPill: {
    backgroundColor: Colors.surfaceBright,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tagText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.greyText,
    lineHeight: 24,
  },
  card: {
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tagPillSmall: {
    backgroundColor: Colors.surfaceHigh,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tagTextSmall: {
    color: Colors.greyText,
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.greyText,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  codeBox: {
    marginTop: 12,
    padding: Spacing.md,
    backgroundColor: Colors.codeBg,
    borderRadius: Radius.md,
  },
  codeText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: Colors.white,
    lineHeight: 18,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
    flex: 1,
  },
  accordionContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceHigh,
    borderStyle: 'dashed',
  },
  sandboxCard: {
    backgroundColor: Colors.surfaceBright,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  sandboxTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 8,
  },
  sandboxText: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 16,
  },
  sandboxBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
  },
  sandboxBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
