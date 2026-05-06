import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/lib/constants';
import type { Message, Match } from '@/lib/types';

type MatchWithEvent = Match & { events: { title: string; start_time: string; address: string } };

export default function Chat() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [match, setMatch] = useState<MatchWithEvent | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMatch();
    fetchMessages();

    // Subscribe to realtime messages
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  async function fetchMatch() {
    const { data } = await supabase
      .from('matches')
      .select('*, events(title, start_time, address)')
      .eq('id', matchId)
      .single();
    setMatch(data as any);
  }

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  }

  async function sendMessage() {
    if (!input.trim() || !user || sending) return;
    setSending(true);

    const { error } = await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: user.id,
      content: input.trim(),
    });

    if (!error) setInput('');
    setSending(false);
  }

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Shared Event Header */}
      {match?.events && (
        <View style={styles.eventBanner}>
          <Ionicons name="calendar" size={16} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.eventBannerTitle} numberOfLines={1}>
              {match.events.title}
            </Text>
            <Text style={styles.eventBannerSub}>
              {new Date(match.events.start_time).toLocaleDateString([], {
                weekday: 'short', month: 'short', day: 'numeric',
              })} - {match.events.address}
            </Text>
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMine = item.sender_id === user?.id;
          return (
            <View
              style={[
                styles.messageBubble,
                isMine ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={[styles.messageText, isMine && { color: '#fff' }]}>
                {item.content}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  isMine && { color: 'rgba(255,255,255,0.7)' },
                ]}
              >
                {item.created_at ? formatTime(item.created_at) : ''}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>
              Say hello to your +1!
            </Text>
          </View>
        }
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && { opacity: 0.4 }]}
          onPress={sendMessage}
          disabled={!input.trim() || sending}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  eventBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, padding: 12, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  eventBannerTitle: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  eventBannerSub: { color: COLORS.textSecondary, fontSize: 12 },
  messageList: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  messageBubble: {
    maxWidth: '80%', borderRadius: 16, padding: 12, marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end', backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start', backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  messageText: { color: COLORS.text, fontSize: 15, lineHeight: 20 },
  messageTime: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 12 },
  emptyText: { color: COLORS.textSecondary, fontSize: 15 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 12, paddingBottom: 24, backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  textInput: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15,
    color: COLORS.text, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border,
  },
  sendButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});
