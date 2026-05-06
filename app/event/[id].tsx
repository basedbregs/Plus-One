import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { COLORS, OPENING_TYPE_LABELS } from '@/lib/constants';
import type { Event, Opening } from '@/lib/types';

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [openings, setOpenings] = useState<(Opening & { profiles: { display_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  async function fetchEvent() {
    setLoading(true);
    const [eventRes, openingsRes] = await Promise.all([
      supabase.from('events').select('*').eq('id', id).single(),
      supabase
        .from('openings')
        .select('*, profiles(display_name)')
        .eq('event_id', id)
        .eq('status', 'open')
        .order('created_at', { ascending: false }),
    ]);
    setEvent(eventRes.data);
    setOpenings((openingsRes.data as any) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>
          {event.category
            ? event.category.charAt(0).toUpperCase() + event.category.slice(1)
            : 'Event'}
        </Text>
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{formatDateTime(event.start_time)}</Text>
        </View>
        {event.end_time && (
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Until {new Date(event.end_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{event.address}</Text>
        </View>
        {event.price_info && (
          <View style={styles.infoRow}>
            <Ionicons name="pricetag" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{event.price_info}</Text>
          </View>
        )}
      </View>

      {event.description && (
        <View style={styles.descSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.postButton}
        onPress={() => router.push({ pathname: '/post-opening', params: { eventId: id } })}
      >
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={styles.postButtonText}>Post a +1 Opening</Text>
      </TouchableOpacity>

      <View style={styles.openingsSection}>
        <Text style={styles.sectionTitle}>
          +1 Openings ({openings.length})
        </Text>
        {openings.length === 0 ? (
          <View style={styles.noOpenings}>
            <Text style={styles.noOpeningsText}>
              No openings yet — be the first to post one!
            </Text>
          </View>
        ) : (
          openings.map((opening) => (
            <TouchableOpacity
              key={opening.id}
              style={styles.openingItem}
              onPress={() => router.push(`/opening/${opening.id}`)}
            >
              <View style={styles.openingHeader}>
                <Text style={styles.openingType}>
                  {opening.type ? OPENING_TYPE_LABELS[opening.type] : 'Opening'}
                </Text>
                <Text style={styles.openingSpots}>
                  {(opening.spots_available || 1) - (opening.spots_filled || 0)} left
                </Text>
              </View>
              <Text style={styles.openingTitle}>{opening.title}</Text>
              <Text style={styles.openingPoster}>
                Posted by {opening.profiles?.display_name || 'User'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  errorText: { color: COLORS.error, fontSize: 16 },
  categoryBadge: { marginBottom: 8 },
  categoryText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginBottom: 20, lineHeight: 32 },
  infoSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { color: COLORS.text, fontSize: 15, flex: 1 },
  descSection: { marginBottom: 20 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  description: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22 },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 24,
  },
  postButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  openingsSection: { marginBottom: 20 },
  noOpenings: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noOpeningsText: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },
  openingItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  openingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  openingType: { color: COLORS.accent, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  openingSpots: { color: COLORS.success, fontSize: 12, fontWeight: '600' },
  openingTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  openingPoster: { color: COLORS.textSecondary, fontSize: 13 },
});
