import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { COLORS, EVENT_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
import { EventCard } from '@/components/EventCard';
import type { Event } from '@/lib/types';

export default function Welcome() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
      .order('start_time', { ascending: true })
      .limit(20);

    if (selectedCategory) {
      query = query.eq('category', selectedCategory as any);
    }

    const { data } = await query;
    setEvents(data || []);
    setLoading(false);
  }

  function handleEventPress() {
    // Anonymous users get prompted to sign up when they try to view details
    router.push('/(auth)/sign-up');
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchEvents} />}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>KNOXVILLE · REAL HUMANS ONLY</Text>
        </View>
        <View style={styles.heroLogo}>
          <Text style={styles.logoPlus}>+</Text>
          <Text style={styles.logoText}>PLUS ONE</Text>
        </View>
        <Text style={styles.heroTitle}>The social media for Knoxville.</Text>
        <Text style={styles.heroSubtitle}>
          Everything you already use — Facebook, Tinder, Reddit, your local concierge —
          built for here, built around real people, and built to actually respect your
          time. A killer app that connects them like never before.
        </Text>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.previewLabel}>What's happening this week ↓</Text>
      </View>

      {/* What is Plus One? */}
      <View style={styles.pitchSection}>
        <Text style={styles.pitchTitle}>How it works.</Text>

        <View style={styles.pitchRow}>
          <View style={styles.pitchIcon}>
            <Text style={styles.pitchNum}>01</Text>
          </View>
          <View style={styles.pitchTextWrap}>
            <Text style={styles.pitchHeader}>Imagine if Facebook ditched the ads, bots, and privacy concerns</Text>
            <Text style={styles.pitchBody}>
              Every account is a real Knoxvillian — verified through UTK email, a
              neighboring college, an in-person sign-up at a partner venue, or three linked
              socials. No fake accounts. No ad targeting on your data. Just real people.
            </Text>
          </View>
        </View>

        <View style={styles.pitchRow}>
          <View style={styles.pitchIcon}>
            <Text style={styles.pitchNum}>02</Text>
          </View>
          <View style={styles.pitchTextWrap}>
            <Text style={styles.pitchHeader}>What if Tinder respected your time and money?</Text>
            <Text style={styles.pitchBody}>
              No paywalls between you and a real match. No swipe gauntlets that go nowhere.
              Match around real events, real plans, real spots — and meet in person fast.
            </Text>
          </View>
        </View>

        <View style={styles.pitchRow}>
          <View style={styles.pitchIcon}>
            <Text style={styles.pitchNum}>03</Text>
          </View>
          <View style={styles.pitchTextWrap}>
            <Text style={styles.pitchHeader}>What if a site planned your whole night out — where AND who?</Text>
            <Text style={styles.pitchBody}>
              The killer app: a frontier-level AI trained on every block of Knoxville. It
              knows the venues, the events, the specials, the vibe — and it knows the
              people. Ask it where to take your parents or how to spend a free Saturday.
              It plans the night and finds your +1.
            </Text>
          </View>
        </View>

        <View style={styles.pitchRow}>
          <View style={styles.pitchIcon}>
            <Text style={styles.pitchNum}>04</Text>
          </View>
          <View style={styles.pitchTextWrap}>
            <Text style={styles.pitchHeader}>What if Reddit had subreddits for niche Knoxville communities?</Text>
            <Text style={styles.pitchBody}>
              Channels for everything — Vols tailgating, the Old City scene, the food
              spots locals don't tell you about, study groups, run clubs, Greek life,
              weekly trivia regulars. Find the corner of Knoxville that's yours.
            </Text>
          </View>
        </View>
      </View>

      {/* Category filter */}
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
                color={item === selectedCategory ? '#fff' : COLORS.textSecondary}
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
              {item ? item.charAt(0).toUpperCase() + item.slice(1) : 'All Events'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Event preview */}
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>Happening soon</Text>
        <Text style={styles.eventsCount}>{events.length} events</Text>
      </View>

      <View style={styles.eventList}>
        {events.map((event) => (
          <View key={event.id} style={{ marginBottom: 12 }}>
            <EventCard event={event} onPress={handleEventPress} />
          </View>
        ))}
        {events.length === 0 && !loading && (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No events to preview yet — check back soon</Text>
          </View>
        )}
      </View>

      {/* CTA bottom */}
      <View style={styles.bottomCta}>
        <Text style={styles.bottomCtaTitle}>Sign up like a person.</Text>
        <Text style={styles.bottomCtaSubtitle}>
          Free during the Knoxville rollout. Verify once, hang with real people, find your
          +1, and go do something tonight.
        </Text>
        <TouchableOpacity
          style={[styles.primaryButton, { width: '100%', marginTop: 12 }]}
          onPress={() => router.push('/(auth)/sign-up')}
        >
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.bottomCtaFinePrint}>
          UTK email · Neighboring-college email · In-person at a partner venue · 3 linked socials
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  hero: {
    paddingTop: 64,
    paddingBottom: 36,
    paddingHorizontal: 24,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.4)',
    marginBottom: 24,
  },
  heroBadgeText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  heroLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    borderWidth: 2,
    borderColor: '#FFE4D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    marginBottom: 24,
    gap: 8,
  },
  logoPlus: { color: COLORS.primary, fontSize: 24, fontWeight: '900' },
  logoText: {
    color: '#FFE4D2',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFE4D2',
    marginBottom: 14,
    textAlign: 'center',
    lineHeight: 40,
    maxWidth: 380,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,228,210,0.78)',
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 420,
    marginBottom: 28,
  },
  heroActions: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,228,210,0.4)',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#FFE4D2', fontSize: 15, fontWeight: '700' },
  previewLabel: {
    fontSize: 11,
    color: 'rgba(255,228,210,0.5)',
    marginTop: 8,
    letterSpacing: 1.5,
  },

  pitchSection: { padding: 24, gap: 16 },
  pitchTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  pitchRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  pitchIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pitchNum: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pitchTextWrap: { flex: 1 },
  pitchHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  pitchBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },

  categories: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
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
  categoryText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: '#fff' },

  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  eventsTitle: { color: COLORS.text, fontSize: 20, fontWeight: '800' },
  eventsCount: { color: COLORS.textSecondary, fontSize: 13 },

  eventList: { padding: 16 },
  empty: { alignItems: 'center', padding: 40, gap: 12 },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },

  bottomCta: {
    margin: 16,
    padding: 24,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  bottomCtaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  bottomCtaSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomCtaFinePrint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
