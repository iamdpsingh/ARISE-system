import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { COLORS, FONTS, S } from '../theme/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  config: { token: string; repo: string; owner: string } | null;
  onSave: (config: { token: string; repo: string; owner: string }) => void;
  onClear: () => void;
  onReset: () => void;
  onTestSync: () => void;
  testingSync: boolean;
}

export default function SettingsModal({ visible, onClose, config, onSave, onClear, onReset, onTestSync, testingSync }: Props) {
  const [token, setToken] = useState(config?.token || '');
  const [repo, setRepo] = useState(config?.repo || '');
  const [owner, setOwner] = useState(config?.owner || '');

  useEffect(() => {
    if (!visible) return;
    setToken(config?.token || '');
    setRepo(config?.repo || '');
    setOwner(config?.owner || '');
  }, [visible, config?.token, config?.repo, config?.owner]);

  const handleSave = () => {
    if (!token || !repo || !owner) return;
    onSave({ token, repo, owner });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={S.spaceBetween}>
            <Text style={S.titleText}>SYSTEM SETTINGS</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ marginTop: 20 }}>
            <Text style={styles.label}>GITHUB PERSONAL ACCESS TOKEN (PAT)</Text>
            <TextInput
              style={styles.input}
              value={token}
              onChangeText={setToken}
              placeholder="ghp_..."
              placeholderTextColor={COLORS.textDim}
              secureTextEntry
              autoCapitalize="none"
            />
            <Text style={S.dimText}>Requires 'repo' scope. Stored only on your device.</Text>

            <Text style={[styles.label, { marginTop: 16 }]}>GITHUB OWNER (USERNAME)</Text>
            <TextInput
              style={styles.input}
              value={owner}
              onChangeText={setOwner}
              placeholder="e.g. hunter123"
              placeholderTextColor={COLORS.textDim}
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>REPOSITORY NAME</Text>
            <TextInput
              style={styles.input}
              value={repo}
              onChangeText={setRepo}
              placeholder="e.g. arise-logs"
              placeholderTextColor={COLORS.textDim}
              autoCapitalize="none"
            />
            <Text style={S.dimText}>The repo must already exist on your GitHub.</Text>

            <View style={styles.btnRow}>
              <TouchableOpacity style={[S.glowBtn, { flex: 1 }]} onPress={handleSave}>
                <Text style={S.glowBtnText}>SYNCHRONIZE SYSTEM</Text>
              </TouchableOpacity>
              
              {config && (
                <TouchableOpacity style={[S.dangerBtn, { marginLeft: 10 }]} onPress={onClear}>
                  <Text style={S.dangerBtnText}>RESET CONFIG</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[S.glowBtn, { marginTop: 10, opacity: config ? 1 : 0.4 }]}
              onPress={onTestSync}
              disabled={!config || testingSync}
            >
              <Text style={S.glowBtnText}>{testingSync ? 'TESTING GITHUB UPLOAD...' : 'TEST LOG UPLOAD NOW'}</Text>
            </TouchableOpacity>
            <Text style={[S.dimText, { marginTop: 8 }]}>
              This uploads/updates today's mission log in your configured GitHub repo.
            </Text>

            <View style={[styles.infoBox, { borderColor: COLORS.danger, marginTop: 40 }]}>
              <Text style={[styles.infoTitle, { color: COLORS.danger }]}>DANGER ZONE</Text>
              <Text style={styles.infoText}>
                Permanently delete all level data, XP, history, and streaks. This cannot be undone.
              </Text>
              <TouchableOpacity 
                style={[S.dangerBtn, { marginTop: 12, backgroundColor: 'rgba(255,0,0,0.1)' }]} 
                onPress={onReset}
              >
                <Text style={S.dangerBtnText}>⚠ FACTORY RESET (PHASE 0)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Why GitHub?</Text>
              <Text style={styles.infoText}>
                The System keeps your records for 30 days locally. To ensure your journey to Shadow Monarch is 
                immortalized, the GitHub integration pushes a Markdown journal entry every day you complete your quests.
              </Text>
              <Text style={[styles.infoText, { marginTop: 8, color: COLORS.success, ...FONTS.system, fontSize: 9 }]}>
                🔒 SECURITY: Tokens entered here are stored ONLY on this device. They are NEVER bundled into the app code or shared.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  content: { 
    backgroundColor: COLORS.bgDeep, 
    borderTopWidth: 2, 
    borderColor: COLORS.cyan, 
    padding: 20, 
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeBtn: { color: COLORS.textSub, fontSize: 24, padding: 4 },
  label: { ...FONTS.system, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  input: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: COLORS.borderDim, 
    color: COLORS.textPrimary, 
    padding: 12, 
    ...FONTS.mono,
    fontSize: 14,
    marginBottom: 4,
  },
  btnRow: { flexDirection: 'row', marginTop: 24 },
  infoBox: { marginTop: 24, padding: 16, backgroundColor: 'rgba(0,150,255,0.05)', borderWidth: 1, borderColor: 'rgba(0,150,255,0.2)' },
  infoTitle: { ...FONTS.system, color: COLORS.cyan, fontSize: 11, marginBottom: 8 },
  infoText: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, lineHeight: 18 },
});
