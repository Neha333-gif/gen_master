import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Colors, Radius, Spacing } from '../theme/theme';
import { Play, Bug, Trash2, Settings, Clock, ArrowLeft } from 'lucide-react-native';
import { codeService } from '../services/api';

export default function EditorScreen({ navigation }: any) {
  const [code, setCode] = useState('# Write your GenAI code here...');
  const [terminalOutput, setTerminalOutput] = useState('$ waiting for execution...');
  const [problemsOutput, setProblemsOutput] = useState('No problems detected.');
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems'>('terminal');
  const [executing, setExecuting] = useState(false);

  const handleRunCode = async () => {
    setExecuting(true);
    setTerminalOutput('$ Executing sequence on Dedicated Backend...\n');
    try {
      const result = await codeService.execute(code);
      if (result.output) {
        setTerminalOutput(prev => prev + '\n' + result.output + '\n[Process Completed]');
      }
      if (result.problems) {
        setProblemsOutput(result.problems);
      } else {
        setProblemsOutput('No problems detected.');
      }
    } catch (error) {
      setTerminalOutput(prev => prev + '\n[Server Error]\n' + error.toString());
    } finally {
      setExecuting(false);
    }
  };

  const handleClearTerminal = () => {
    setTerminalOutput('$ Terminal cleared.');
    setProblemsOutput('No problems detected.');
  };

  const handleClearCode = () => {
    setCode('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>AI Codespace</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>0 🔥</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={[styles.primaryBtnSmall, executing && { opacity: 0.7 }]} 
          onPress={handleRunCode}
          disabled={executing}
        >
          {executing ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Play size={14} color={Colors.white} fill={Colors.white} />
              <Text style={styles.btnText}>Run</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtnSmall} onPress={handleClearTerminal}>
          <Bug size={14} color={Colors.greyText} />
          <Text style={styles.secondaryBtnText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleClearCode}>
          <Trash2 size={16} color={Colors.greyText} />
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.iconBtn}>
          <Settings size={16} color={Colors.greyText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Clock size={16} color={Colors.greyText} />
        </TouchableOpacity>
      </View>

      <View style={styles.editorWindow}>
        <View style={styles.editorBar}>
          <Text style={styles.fileName}>main.py</Text>
          <View style={styles.windowControls}>
            <View style={[styles.dot, { backgroundColor: '#f87171' }]} />
            <View style={[styles.dot, { backgroundColor: '#fbbf24' }]} />
            <View style={[styles.dot, { backgroundColor: '#34d399' }]} />
          </View>
        </View>
        <TextInput
          style={styles.codeArea}
          multiline
          value={code}
          onChangeText={setCode}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.terminalSection}>
        <View style={styles.terminalTabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'terminal' && styles.activeTab]}
            onPress={() => setActiveTab('terminal')}
          >
            <Text style={[styles.tabText, activeTab === 'terminal' && styles.activeTabText]}>TERMINAL</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'problems' && styles.activeTab]}
            onPress={() => setActiveTab('problems')}
          >
            <Text style={[styles.tabText, activeTab === 'problems' && styles.activeTabText]}>PROBLEMS</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.terminalScroll}>
          <Text style={[styles.terminalContent, activeTab === 'problems' && { color: '#ffab70' }]}>
            {activeTab === 'terminal' ? terminalOutput : problemsOutput}
          </Text>
        </ScrollView>
      </View>
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
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
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
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: 10,
    alignItems: 'center',
  },
  primaryBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
  },
  btnText: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  secondaryBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
  },
  secondaryBtnText: {
    color: Colors.greyText,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
  },
  spacer: {
    flex: 1,
  },
  editorWindow: {
    marginHorizontal: Spacing.lg,
    flex: 1,
    backgroundColor: Colors.codeBg,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  editorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fileName: {
    color: Colors.greyText,
    fontSize: 12,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  windowControls: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  codeArea: {
    flex: 1,
    padding: Spacing.md,
    color: Colors.white,
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  terminalSection: {
    padding: Spacing.lg,
    height: 180,
  },
  terminalTabs: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surface,
    marginBottom: 8,
  },
  tab: {
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.greyText,
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  activeTabText: {
    color: Colors.primary,
  },
  terminalScroll: {
    flex: 1,
  },
  terminalContent: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 13,
    color: Colors.greyText,
    lineHeight: 18,
  },
});
