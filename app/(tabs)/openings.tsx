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
import { COLORS, OPENING_TYPE_LABELS } from '@/lib/constants';
import { OpeningCard } from '@/components/OpeningCard';
import type { OpeningWithEvent } from '@/lib/types';

export default function Openings() {
  const router = useRouter();
  const [openings, setOpenings] = useState<OpeningWithEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpenings();
  }, []);

  async function fetchOpenings() {
    setLoading(true);
    const { data } = await supabase
      .from('openings')
      .select('*, events(*), profiles(*)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    setOpenings((data as any) || []);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>+1 Openings</Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => router.push('/post-opening')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={openings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OpeningCard
            opening={item}
            onPress={() => router.push(`/opening/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchOpenings} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="briefcase-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No openings yet</Text>
            <Text style={styles.emptyText}>
              Be the first to post a +1 opening for an event!
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => router.push('/post-opening')}
            >
              <Text style={styles.emptyCtaText}>Post an Opening</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
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
  },
  emptyCta: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyCtaText: {
    color: '#fff',
    fontWeight: '600',
  },
});
