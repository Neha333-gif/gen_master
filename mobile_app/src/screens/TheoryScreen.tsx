import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Radius, Spacing } from '../theme/theme';
import { ChevronRight } from 'lucide-react-native';
import { theoryModules, TheoryModule } from '../services/modulesData';

export default function TheoryScreen({ navigation }: any) {
  
  const renderModuleCard = ({ item }: { item: TheoryModule }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('TheoryDetail', { module: item })}
      activeOpacity={0.7}
    >
      <View style={styles.moduleNumberContainer}>
        <Text style={styles.moduleNumber}>{item.id}</Text>
      </View>
      <View style={styles.moduleInfo}>
        <Text style={styles.moduleTitle}>{item.title}</Text>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={Colors.greyText} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GenAI Curriculum</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{theoryModules.length} Modules</Text>
        </View>
      </View>
      
      <Text style={styles.subHeader}>Select a theory module to begin your learning journey.</Text>

      <FlatList
        data={theoryModules}
        renderItem={renderModuleCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Manrope_800ExtraBold',
    color: Colors.white,
  },
  countBadge: {
    backgroundColor: Colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
  },
  countText: {
    color: Colors.tertiary,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  subHeader: {
    paddingHorizontal: Spacing.lg,
    color: Colors.greyText,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 14, 26, 0.7)',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceHigh,
  },
  moduleNumberContainer: {
    width: 40,
    alignItems: 'center',
  },
  moduleNumber: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_700Bold',
    color: Colors.tertiary,
  },
  moduleInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  moduleTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
    marginBottom: 4,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceHigh,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagText: {
    color: Colors.greyText,
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
});
