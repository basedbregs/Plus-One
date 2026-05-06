import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { COLORS, EVENT_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
import { EventCard } from '@/components/EventCard';
import type { Event } from '@/lib/types';

export default function Discover() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  async function fetchEvents() {
    setLoading(true);
    let query = supabase
      .from('events')
      .select('*')
      .eq('status', 'active')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });

    if (selectedCategory) {
      query = query.eq('category', selectedCategory as any);
    }

    const { data } = await query;
    setEvents(data || []);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[null, ...EVENT_CATEGORIES]}
        keyExtractor={(item) => item || 'all'}
        contentContainerStyle={styles.categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              (item === selectedCategory || (!item && !selectedCategory)) &&
                styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            {item && (
              <Ionicons
                name={(CATEGORY_ICONS[item] || 'ellipsis-horizontal') as any}
                size={14}
                color={
                  item === selectedCategory ? '#fff' : COLORS.textSecondary
                }
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={[
                styles.categoryText,
                (item === selectedCategory || (!item && !selectedCategory)) &&
                  styles.categoryTextActive,
              ]}
            >
              {item
                ? item.charAt(0).toUpperCase() + item.slice(1)
                : 'All Events'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <Text style={styles.sectionTitle}>
          {events.length} Upcoming Events
        </Text>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        >
          <Ionicons
            name={viewMode === 'list' ? 'map' : 'list'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push(`/event/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchEvents} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="calendar-outline"
                size={64}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyTitle}>No upcoming events</Text>
              <Text style={styles.emptyText}>
                Check back soon for events in Downtown Knoxville & UTK Campus
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Map View</Text>
          <Text style={styles.emptyText}>
            Mapbox integration coming soon — add your API key to enable
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
