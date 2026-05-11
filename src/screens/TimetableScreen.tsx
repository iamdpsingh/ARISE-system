import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, S, FONTS } from '../theme/theme';
import { DAILY_TIMETABLE } from '../data/timetable';
import type { TimeBlock } from '../data/timetable';

interface Props {
  timetable: TimeBlock[];
  onSaveTimetable: (timetable: TimeBlock[]) => void;
  onResetTimetable: () => void;
}

export default function TimetableScreen({ timetable, onSaveTimetable, onResetTimetable }: Props) {
  const [editingTimetable, setEditingTimetable] = useState(false);
  const [draftTimetable, setDraftTimetable] = useState<TimeBlock[]>([]);

  const startTimetableEdit = () => {
    setDraftTimetable(timetable.map(item => ({ ...item })));
    setEditingTimetable(true);
  };

  const cancelTimetableEdit = () => {
    setEditingTimetable(false);
    setDraftTimetable([]);
  };

  const updateTimetableSlot = (index: number, key: keyof TimeBlock, value: string) => {
    setDraftTimetable(prev => prev.map((slot, i) => {
      if (i !== index) return slot;
      return { ...slot, [key]: value };
    }));
  };

  const addTimetableSlot = () => {
    setDraftTimetable(prev => [...prev, { start: '', end: '', task: '', note: '' }]);
  };

  const removeTimetableSlot = (index: number) => {
    setDraftTimetable(prev => prev.filter((_, i) => i !== index));
  };

  const saveTimetable = () => {
    const cleaned = draftTimetable
      .map(slot => ({
        start: slot.start.trim(),
        end: slot.end?.trim() || undefined,
        task: slot.task.trim(),
        note: slot.note?.trim() || undefined,
      }))
      .filter(slot => slot.start && slot.task);

    if (cleaned.length === 0) {
      Alert.alert('Invalid Timetable', 'At least one valid timetable row is required.');
      return;
    }

    onSaveTimetable(cleaned);
    setEditingTimetable(false);
    setDraftTimetable([]);
  };

  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.sysTag}>{'[ TIMETABLE ]'}</Text>
          <View style={S.spaceBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={S.titleText}>DAILY SCHEDULE</Text>
              <Text style={S.subText}>
                Keep your study, training, and work blocks in one place.
              </Text>
            </View>
            <View style={styles.slotBubble}>
              <Text style={styles.slotBubbleTxt}>{timetable.length}</Text>
              <Text style={styles.slotBubbleLbl}>SLOTS</Text>
            </View>
          </View>
        </View>

        <View style={S.panel}>
          <View style={S.spaceBetween}>
            <Text style={S.sectionTitle}>Daily Timetable</Text>
            {!editingTimetable ? (
              <TouchableOpacity style={styles.tinyBtn} onPress={startTimetableEdit}>
                <Text style={styles.tinyBtnText}>EDIT</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.tinyBtn, styles.tinyBtnDanger]} onPress={cancelTimetableEdit}>
                <Text style={[styles.tinyBtnText, styles.tinyBtnTextDanger]}>CANCEL</Text>
              </TouchableOpacity>
            )}
          </View>

          {!editingTimetable ? (
            <>
              {timetable.map((slot, idx) => (
                <View key={`${slot.start}_${slot.end || 'single'}_${idx}`} style={styles.timeRow}>
                  <Text style={styles.timeRange}>{slot.end ? `${slot.start} - ${slot.end}` : slot.start}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.timeTask}>{slot.task}</Text>
                    {slot.note ? <Text style={styles.timeNote}>{slot.note}</Text> : null}
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={[S.dangerBtn, { marginTop: 12 }]}
                onPress={() => {
                  onResetTimetable();
                  Alert.alert('Timetable Reset', 'Default timetable has been restored.');
                }}
              >
                <Text style={S.dangerBtnText}>RESET DEFAULT TIMETABLE</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {draftTimetable.map((slot, idx) => (
                <View key={`edit_${idx}`} style={styles.editCard}>
                  <View style={styles.editRow}>
                    <TextInput
                      style={[styles.editInput, styles.editTime]}
                      value={slot.start}
                      onChangeText={(value) => updateTimetableSlot(idx, 'start', value)}
                      placeholder="Start (e.g. 5:00 AM)"
                      placeholderTextColor={COLORS.textDim}
                    />
                    <TextInput
                      style={[styles.editInput, styles.editTime]}
                      value={slot.end || ''}
                      onChangeText={(value) => updateTimetableSlot(idx, 'end', value)}
                      placeholder="End (optional)"
                      placeholderTextColor={COLORS.textDim}
                    />
                  </View>
                  <TextInput
                    style={styles.editInput}
                    value={slot.task}
                    onChangeText={(value) => updateTimetableSlot(idx, 'task', value)}
                    placeholder="Task"
                    placeholderTextColor={COLORS.textDim}
                  />
                  <TextInput
                    style={styles.editInput}
                    value={slot.note || ''}
                    onChangeText={(value) => updateTimetableSlot(idx, 'note', value)}
                    placeholder="Note (optional)"
                    placeholderTextColor={COLORS.textDim}
                  />
                  <TouchableOpacity style={styles.removeEditBtn} onPress={() => removeTimetableSlot(idx)}>
                    <Text style={styles.removeEditBtnText}>REMOVE SLOT</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={[S.glowBtn, { marginTop: 8 }]} onPress={addTimetableSlot}>
                <Text style={S.glowBtnText}>ADD NEW SLOT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[S.glowBtn, { marginTop: 8 }]} onPress={saveTimetable}>
                <Text style={S.glowBtnText}>SAVE TIMETABLE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[S.dangerBtn, { marginTop: 8 }]}
                onPress={() => {
                  onResetTimetable();
                  setDraftTimetable(DAILY_TIMETABLE.map(item => ({ ...item })));
                }}
              >
                <Text style={S.dangerBtnText}>RESET DEFAULT TIMETABLE</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            Use consistent AM/PM format so timetable widgets show the correct current and next slot.
          </Text>
        </View>

        <View style={{ height: 96 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  header: { marginBottom: 12 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 10 },
  slotBubble: { backgroundColor: 'rgba(240,192,64,0.1)', borderWidth: 1, borderColor: COLORS.xp, padding: 10, alignItems: 'center', minWidth: 80 },
  slotBubbleTxt: { ...FONTS.title, color: COLORS.xp, fontSize: 18 },
  slotBubbleLbl: { ...FONTS.system, color: COLORS.xp, fontSize: 9, letterSpacing: 2 },
  tinyBtn: {
    borderWidth: 1,
    borderColor: COLORS.cyan,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 243, 255, 0.08)',
  },
  tinyBtnDanger: {
    borderColor: COLORS.danger,
    backgroundColor: 'rgba(255, 0, 0, 0.08)',
  },
  tinyBtnText: { ...FONTS.system, color: COLORS.cyan, fontSize: 9, letterSpacing: 1.5 },
  tinyBtnTextDanger: { color: COLORS.danger },
  timeRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.borderDim, paddingVertical: 9 },
  timeRange: { ...FONTS.mono, color: COLORS.cyan, fontSize: 10, width: 120, paddingRight: 10 },
  timeTask: { ...FONTS.body, color: COLORS.textPrimary, fontSize: 12, lineHeight: 16 },
  timeNote: { ...FONTS.body, color: COLORS.warning, fontSize: 10, marginTop: 2, fontStyle: 'italic' },
  editCard: {
    borderWidth: 1,
    borderColor: COLORS.borderDim,
    backgroundColor: 'rgba(0,20,55,0.4)',
    padding: 10,
    marginBottom: 8,
  },
  editRow: { flexDirection: 'row', gap: 8 },
  editInput: {
    borderWidth: 1,
    borderColor: COLORS.borderDim,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: COLORS.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 6,
    ...FONTS.body,
    fontSize: 12,
  },
  editTime: { flex: 1 },
  removeEditBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.1)',
  },
  removeEditBtnText: { ...FONTS.system, color: COLORS.danger, fontSize: 10, letterSpacing: 1.5 },
  noteBox: { borderWidth: 1, borderColor: 'rgba(0, 243, 255, 0.2)', backgroundColor: 'rgba(0, 243, 255, 0.06)', padding: 12, marginTop: 8 },
  noteText: { ...FONTS.body, color: COLORS.cyan, fontSize: 12, lineHeight: 18 },
});
