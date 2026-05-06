import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/lib/constants';

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

// Public routes anonymous users can access without redirect
const PUBLIC_ROUTES = ['welcome', '(auth)'];

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, profile, loading, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const onPublicRoute = PUBLIC_ROUTES.includes(segments[0] as string);

    if (!session && !onPublicRoute) {
      // Anonymous users go to welcome by default (browse-before-signup)
      router.replace('/welcome' as any);
    } else if (session && inAuthGroup) {
      if (profile && !profile.onboarding_complete) {
        router.replace('/(onboarding)/resume');
      } else {
        router.replace('/(tabs)/discover');
      }
    } else if (session && profile && !profile.onboarding_complete && !inOnboarding) {
      router.replace('/(onboarding)/resume');
    }
  }, [session, profile, initialized]);

  if (loading) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      initialize().then(() => SplashScreen.hideAsync());
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.text,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="event/[id]"
            options={{ title: 'Event Details', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="opening/[id]"
            options={{ title: 'Opening Details', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="chat/[matchId]"
            options={{ title: 'Chat', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="post-opening"
            options={{ title: 'Post Opening', presentation: 'modal' }}
          />
        </Stack>
        <StatusBar style="dark" />
      </AuthGate>
    </QueryClientProvider>
  );
}
