import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/lib/constants';
import type { Match, Opening, Application } from '@/lib/types';

type MatchWithEvent = Match & { events: { title: string; start_time: string; address: string } };
type ApplicationWithOpening = Application & { openings: { title: string; events: { title: string } } };
type OpeningWithApps = Opening & { events: { title: string }; applications: { id: string; status: string }[] };

export default function Activity() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<MatchWithEvent[]>([]);
  const [myOpenings, setMyOpenings] = useState<OpeningWithApps[]>([]);
  const [myApplications, setMyApplications] = useState<ApplicationWithOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchActivity();
  }, [user]);

  async function fetchActivity() {
    if (!user) return;
    setLoading(true);

    const [matchRes, openingRes, appRes] = await Promise.all([
      supabase
        .from('matches')
        .select('*, events(title, start_time, address)')
        .or(`poster_id.eq.${user.id},applicant_id.eq.${user.id}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false }),
      supabase
        .from('openings')
        .select('*, events(title), applications(id, status)')
        .eq('poster_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('applications')
        .select('*, openings(title, events(title))')
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    setMatches((matchRes.data as any) || []);
    setMyOpenings((openingRes.data as any) || []);
    setMyApplications((appRes.data as any) || []);
    setLoading(false);
  }

  const sections = [
    {
      title: 'Active Matches',
      icon: 'heart' as const,
      data: matches,
      type: 'match' as const,
    },
    {
      title: 'My Openings',
      icon: 'megaphone' as const,
      data: myOpenings,
      type: 'opening' as const,
    },
    {
      title: 'My Requests',
      icon: 'paper-plane' as const,
      data: myApplications,
      type: 'application' as const,
    },
  ].filter((s) => s.data.length > 0);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections as any}
        keyExtractor={(item: any) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Ionicons name={(section as any).icon} size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item, section }) => {
          if ((section as any).type === 'match') {
            const match = item as MatchWithEvent;
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => router.push(`/chat/${match.id}`)}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{match.events?.title}</Text>
                  <Text style={styles.itemSub}>
                    {match.events?.address}
                  </Text>
                </View>
                <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            );
          }
          if ((section as any).type === 'opening') {
            const opening = item as OpeningWithApps;
            const pendingCount = opening.applications?.filter(
              (a) => a.status === 'pending'
            ).length || 0;
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => router.push(`/opening/${opening.id}`)}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{opening.title}</Text>
                  <Text style={styles.itemSub}>
                    {opening.events?.title}
                  </Text>
                </View>
                {pendingCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pendingCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }
          const app = item as ApplicationWithOpening;
          return (
            <TouchableOpacity style={styles.item}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{app.openings?.title}</Text>
                <Text style={styles.itemSub}>{app.openings?.events?.title}</Text>
              </View>
              <Text
                style={[
                  styles.status,
                  app.status === 'accepted' && { color: COLORS.success },
                  app.status === 'rejected' && { color: COLORS.error },
                ]}
              >
                {app.status?.charAt(0).toUpperCase() + (app.status?.slice(1) || '')}
              </Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchActivity} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="sparkles-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptyText}>
              Post an opening or send a request to get started!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, paddingBottom: 40 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', flex: 1 },
  sectionCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemContent: { flex: 1, gap: 4 },
  itemTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  itemSub: { color: COLORS.textSecondary, fontSize: 13 },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  status: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: '600' },
  emptyText: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },
});
