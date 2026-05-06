import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { COLORS, OPENING_TYPE_LABELS, OPENING_TYPES } from '@/lib/constants';
import type { Event } from '@/lib/types';

export default function PostOpening() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [type, setType] = useState<string>('solo_plus_one');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spots, setSpots] = useState('1');
  const [loading, setLoading] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(!eventId);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'active')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });
    setEvents(data || []);
  }

  async function handlePost() {
    if (!selectedEventId) {
      Alert.alert('Error', 'Please select an event');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Please add a title');
      return;
    }
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from('openings').insert({
      event_id: selectedEventId,
      poster_id: user.id,
      type: type as any,
      title: title.trim(),
      description: description.trim() || null,
      spots_available: parseInt(spots) || 1,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Posted!', 'Your +1 opening is live.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
    setLoading(false);
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Post a +1 Opening</Text>
      <Text style={styles.subtitle}>
        Find the right person to share an event with
      </Text>

      {/* Event Selection */}
      <View style={styles.field}>
        <Text style={styles.label}>Event *</Text>
        {selectedEvent && !showEventPicker ? (
          <TouchableOpacity
            style={styles.selectedEvent}
            onPress={() => setShowEventPicker(true)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedEventTitle}>{selectedEvent.title}</Text>
              <Text style={styles.selectedEventDate}>
                {new Date(selectedEvent.start_time).toLocaleDateString([], {
                  weekday: 'short', month: 'short', day: 'numeric',
                })}
              </Text>
            </View>
            <Ionicons name="swap-horizontal" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.eventList}>
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventOption,
                  event.id === selectedEventId && styles.eventOptionSelected,
                ]}
                onPress={() => {
                  setSelectedEventId(event.id);
                  setShowEventPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.eventOptionTitle,
                    event.id === selectedEventId && { color: COLORS.primary },
                  ]}
                  numberOfLines={1}
                >
                  {event.title}
                </Text>
                <Text style={styles.eventOptionDate}>
                  {new Date(event.start_time).toLocaleDateString([], {
                    month: 'short', day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
            ))}
            {events.length === 0 && (
              <Text style={styles.noEvents}>
                No upcoming events. Check back later!
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Opening Type */}
      <View style={styles.field}>
        <Text style={styles.label}>Type *</Text>
        <View style={styles.typeGrid}>
          {OPENING_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeOption, type === t && styles.typeOptionSelected]}
              onPress={() => setType(t)}
            >
              <Text
                style={[
                  styles.typeOptionText,
                  type === t && styles.typeOptionTextSelected,
                ]}
              >
                {OPENING_TYPE_LABELS[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Looking for a concert buddy!"
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Any details about what you're looking for..."
          placeholderTextColor={COLORS.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={300}
        />
      </View>

      {/* Spots */}
      <View style={styles.field}>
        <Text style={styles.label}>Spots Available</Text>
        <View style={styles.spotsRow}>
          {['1', '2', '3', '4'].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.spotOption, spots === n && styles.spotOptionSelected]}
              onPress={() => setSpots(n)}
            >
              <Text
                style={[
                  styles.spotOptionText,
                  spots === n && styles.spotOptionTextSelected,
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.postButton, loading && { opacity: 0.6 }]}
        onPress={handlePost}
        disabled={loading}
      >
        <Text style={styles.postButtonText}>
          {loading ? 'Posting...' : 'Post Opening'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, marginBottom: 24 },
  field: { marginBottom: 20 },
  label: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, fontSize: 15,
    color: COLORS.text, borderWidth: 1, borderColor: COLORS.border,
  },
  selectedEvent: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: COLORS.primary,
  },
  selectedEventTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  selectedEventDate: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  eventList: { gap: 6 },
  eventOption: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  eventOptionSelected: { borderColor: COLORS.primary },
  eventOptionTitle: { color: COLORS.text, fontSize: 14, flex: 1 },
  eventOptionDate: { color: COLORS.textSecondary, fontSize: 12 },
  noEvents: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', padding: 20 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  typeOptionSelected: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  typeOptionText: { color: COLORS.textSecondary, fontSize: 13 },
  typeOptionTextSelected: { color: COLORS.primary, fontWeight: '600' },
  spotsRow: { flexDirection: 'row', gap: 8 },
  spotOption: {
    width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  spotOptionSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  spotOptionText: { color: COLORS.textSecondary, fontSize: 18, fontWeight: '600' },
  spotOptionTextSelected: { color: '#fff' },
  postButton: {
    backgroundColor: COLORS.primary, borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  postButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
