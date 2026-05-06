import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { COLORS, OPENING_TYPE_LABELS } from '@/lib/constants';
import type { OpeningWithEvent, Application } from '@/lib/types';

export default function OpeningDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const [opening, setOpening] = useState<OpeningWithEvent | null>(null);
  const [applications, setApplications] = useState<(Application & { profiles: { display_name: string; bio: string | null; interests: string[] | null } })[]>([]);
  const [myApplication, setMyApplication] = useState<Application | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const isOwner = user?.id === opening?.poster_id;

  useEffect(() => {
    fetchOpening();
  }, [id]);

  async function fetchOpening() {
    setLoading(true);
    const [openingRes, appsRes] = await Promise.all([
      supabase
        .from('openings')
        .select('*, events(*), profiles(*)')
        .eq('id', id)
        .single(),
      supabase
        .from('applications')
        .select('*, profiles(display_name, bio, interests)')
        .eq('opening_id', id)
        .order('created_at', { ascending: false }),
    ]);
    setOpening(openingRes.data as any);

    const apps = (appsRes.data || []) as any[];
    setApplications(apps);
    setMyApplication(apps.find((a: any) => a.applicant_id === user?.id) || null);
    setLoading(false);
  }

  async function handleApply() {
    if (!user || !opening) return;
    setApplying(true);
    const { error } = await supabase.from('applications').insert({
      opening_id: opening.id,
      applicant_id: user.id,
      cover_letter: coverLetter.trim() || null,
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Sent!', 'Your +1 request has been sent.');
      setShowApplyForm(false);
      fetchOpening();
    }
    setApplying(false);
  }

  async function handleAccept(applicationId: string, applicantId: string) {
    if (!opening || !user) return;
    // Update application status
    await supabase
      .from('applications')
      .update({ status: 'accepted' })
      .eq('id', applicationId);

    // Create match
    await supabase.from('matches').insert({
      opening_id: opening.id,
      poster_id: user.id,
      applicant_id: applicantId,
      event_id: opening.event_id,
    });

    // Update spots
    await supabase
      .from('openings')
      .update({ spots_filled: (opening.spots_filled || 0) + 1 })
      .eq('id', opening.id);

    Alert.alert('Matched!', 'You can now chat with your +1.');
    fetchOpening();
  }

  async function handleReject(applicationId: string) {
    await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);
    fetchOpening();
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!opening) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Opening not found</Text>
      </View>
    );
  }

  const spotsLeft = (opening.spots_available || 1) - (opening.spots_filled || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>
          {opening.type ? OPENING_TYPE_LABELS[opening.type] : 'Opening'}
        </Text>
        <View style={styles.spotsBadge}>
          <Text style={styles.spotsText}>
            {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{opening.title}</Text>

      {opening.description && (
        <Text style={styles.description}>{opening.description}</Text>
      )}

      {opening.events && (
        <View style={styles.eventCard}>
          <Text style={styles.eventLabel}>EVENT</Text>
          <Text style={styles.eventTitle}>{opening.events.title}</Text>
          <View style={styles.eventDetail}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.eventDetailText}>
              {new Date(opening.events.start_time).toLocaleDateString([], {
                weekday: 'short', month: 'short', day: 'numeric',
              })} at {new Date(opening.events.start_time).toLocaleTimeString([], {
                hour: 'numeric', minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.eventDetailText}>{opening.events.address}</Text>
          </View>
        </View>
      )}

      {/* Apply Section (for non-owners) */}
      {!isOwner && spotsLeft > 0 && !myApplication && (
        <>
          {showApplyForm ? (
            <View style={styles.applyForm}>
              <Text style={styles.applyLabel}>Add a message (optional)</Text>
              <TextInput
                style={styles.applyInput}
                placeholder="Why are you the perfect +1 for this?"
                placeholderTextColor={COLORS.textSecondary}
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
                maxLength={300}
              />
              <TouchableOpacity
                style={[styles.applyButton, applying && { opacity: 0.6 }]}
                onPress={handleApply}
                disabled={applying}
              >
                <Text style={styles.applyButtonText}>
                  {applying ? 'Sending...' : 'Send Request'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowApplyForm(true)}
            >
              <Ionicons name="hand-right" size={20} color="#fff" />
              <Text style={styles.applyButtonText}>I'm In</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {myApplication && (
        <View style={styles.statusCard}>
          <Ionicons
            name={myApplication.status === 'accepted' ? 'checkmark-circle' : 'hourglass'}
            size={24}
            color={myApplication.status === 'accepted' ? COLORS.success : COLORS.warning}
          />
          <Text style={styles.statusText}>
            Request {myApplication.status}
          </Text>
        </View>
      )}

      {/* Applications (for owner) */}
      {isOwner && (
        <View style={styles.applicationsSection}>
          <Text style={styles.sectionTitle}>
            Requests ({applications.length})
          </Text>
          {applications.map((app) => (
            <View key={app.id} style={styles.applicationCard}>
              <Text style={styles.applicantName}>
                {app.profiles?.display_name || 'User'}
              </Text>
              {app.profiles?.bio && (
                <Text style={styles.applicantBio}>{app.profiles.bio}</Text>
              )}
              {app.profiles?.interests && app.profiles.interests.length > 0 && (
                <View style={styles.applicantInterests}>
                  {app.profiles.interests.slice(0, 3).map((i) => (
                    <View key={i} style={styles.interestChip}>
                      <Text style={styles.interestText}>{i}</Text>
                    </View>
                  ))}
                </View>
              )}
              {app.cover_letter && (
                <View style={styles.coverLetter}>
                  <Text style={styles.coverLetterLabel}>Note</Text>
                  <Text style={styles.coverLetterText}>{app.cover_letter}</Text>
                </View>
              )}
              {app.status === 'pending' && (
                <View style={styles.applicationActions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(app.id, app.applicant_id)}
                  >
                    <Ionicons name="checkmark" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(app.id)}
                  >
                    <Ionicons name="close" size={18} color={COLORS.error} />
                    <Text style={[styles.actionButtonText, { color: COLORS.error }]}>
                      Pass
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {app.status !== 'pending' && (
                <Text style={[
                  styles.appStatus,
                  app.status === 'accepted' && { color: COLORS.success },
                  app.status === 'rejected' && { color: COLORS.error },
                ]}>
                  {app.status?.charAt(0).toUpperCase() + (app.status?.slice(1) || '')}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  errorText: { color: COLORS.error, fontSize: 16 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  typeText: { color: COLORS.accent, fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  spotsBadge: { backgroundColor: COLORS.success + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  spotsText: { color: COLORS.success, fontSize: 12, fontWeight: '600' },
  title: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 12, lineHeight: 30 },
  description: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  eventCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  eventLabel: { color: COLORS.primary, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  eventTitle: { color: COLORS.text, fontSize: 17, fontWeight: '600', marginBottom: 10 },
  eventDetail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  eventDetailText: { color: COLORS.textSecondary, fontSize: 13 },
  applyForm: { marginBottom: 20 },
  applyLabel: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  applyInput: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, fontSize: 15,
    color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, height: 100,
    textAlignVertical: 'top', marginBottom: 12,
  },
  applyButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, gap: 8, marginBottom: 20,
  },
  applyButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statusText: { color: COLORS.text, fontSize: 16, fontWeight: '600', textTransform: 'capitalize' },
  applicationsSection: { marginTop: 8 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  applicationCard: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  applicantName: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  applicantBio: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 8 },
  applicantInterests: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  interestChip: { backgroundColor: COLORS.primary + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  interestText: { color: COLORS.primary, fontSize: 12 },
  coverLetter: {
    backgroundColor: COLORS.surfaceLight, borderRadius: 8, padding: 12, marginBottom: 12,
  },
  coverLetterLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', marginBottom: 4 },
  coverLetterText: { color: COLORS.text, fontSize: 14, lineHeight: 20 },
  applicationActions: { flexDirection: 'row', gap: 8 },
  acceptButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.success, borderRadius: 10, padding: 12, gap: 6,
  },
  rejectButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 12, gap: 6,
    borderWidth: 1, borderColor: COLORS.error,
  },
  actionButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  appStatus: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', textTransform: 'capitalize', marginTop: 8 },
});
