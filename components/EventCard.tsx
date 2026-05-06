import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, CATEGORY_ICONS } from '@/lib/constants';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

// Category-based gradient colors for fallback when no image
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  music: ['#1a1a2e', '#e94560'],
  sports: ['#FF6B35', '#F7C948'],
  food: ['#D4572A', '#F7C948'],
  nightlife: ['#1a1a2e', '#6C5CE7'],
  festival: ['#E8593A', '#FFB347'],
  study: ['#8D6E63', '#D7CCC8'],
  campus: ['#FF8F00', '#FFD54F'],
  arts: ['#6A1B9A', '#E1BEE7'],
  comedy: ['#FFA000', '#FFE082'],
  other: ['#9B7B6B', '#D4A574'],
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;

  return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} · ${time}`;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const category = event.category || 'other';
  const categoryIcon = CATEGORY_ICONS[category] || 'ellipsis-horizontal';
  const [c1, c2] = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.other;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Image / fallback */}
      <View style={styles.imageWrap}>
        {event.image_url ? (
          <Image source={{ uri: event.image_url }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.imageFallback,
              { backgroundColor: c1 },
            ]}
          >
            <View style={[styles.imageFallbackOverlay, { backgroundColor: c2, opacity: 0.5 }]} />
            <Ionicons
              name={categoryIcon as any}
              size={48}
              color="rgba(255,255,255,0.85)"
              style={styles.fallbackIcon}
            />
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Ionicons name={categoryIcon as any} size={12} color="#fff" />
          <Text style={styles.categoryText}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {formatDate(event.start_time)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.address}
            </Text>
          </View>
          {event.price_info && (
            <View style={styles.detailRow}>
              <Ionicons name="pricetag-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {event.price_info}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.cta}>View details & openings</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#8B6550',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrap: { position: 'relative', height: 140, backgroundColor: COLORS.surfaceLight },
  image: { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  imageFallbackOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  fallbackIcon: { zIndex: 1 },
  categoryBadge: {
    position: 'absolute',
    top: 12, left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  body: { padding: 14 },
  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 22,
  },
  details: {
    gap: 5,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  cta: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
