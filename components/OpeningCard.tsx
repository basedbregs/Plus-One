import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, OPENING_TYPE_LABELS } from '@/lib/constants';
import type { OpeningWithEvent } from '@/lib/types';

interface OpeningCardProps {
  opening: OpeningWithEvent;
  onPress: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (date.toDateString() === now.toDateString()) return `Today at ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${time}`;
  return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at ${time}`;
}

export function OpeningCard({ opening, onPress }: OpeningCardProps) {
  const typeLabel = opening.type ? OPENING_TYPE_LABELS[opening.type] : 'Opening';
  const spotsLeft = (opening.spots_available || 1) - (opening.spots_filled || 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{typeLabel}</Text>
        {opening.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={10} color={COLORS.accent} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {opening.title}
      </Text>

      <View style={styles.eventInfo}>
        <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
        <Text style={styles.eventTitle} numberOfLines={1}>
          {opening.events?.title || 'Event'}
        </Text>
      </View>

      {opening.events && (
        <View style={styles.eventMeta}>
          <Text style={styles.metaText}>
            {formatDate(opening.events.start_time)}
          </Text>
          <Text style={styles.metaDot}>  </Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {opening.events.address}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.posterInfo}>
          <Ionicons name="person-circle" size={18} color={COLORS.textSecondary} />
          <Text style={styles.posterName}>
            {opening.profiles?.display_name || 'User'}
          </Text>
        </View>
        <View style={styles.spots}>
          <Text style={styles.spotsText}>
            {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  featuredText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 22,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 20,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flexShrink: 1,
  },
  metaDot: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  posterName: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  spots: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spotsText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
  },
});
