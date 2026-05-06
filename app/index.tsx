import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const { session, profile, loading } = useAuthStore();

  if (loading) return null;

  // Browse-before-signup: anonymous users land on the welcome page
  if (!session) {
    return <Redirect href={"/welcome" as any} />;
  }

  if (profile && !profile.onboarding_complete) {
    return <Redirect href="/(onboarding)/resume" />;
  }

  return <Redirect href="/(tabs)/discover" />;
}
