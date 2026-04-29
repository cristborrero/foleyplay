'use client';

import { useRouter } from 'next/navigation';
import { useTVNavigation } from '@/hooks/useTVNavigation';

export default function TVBackHandler() {
  const router = useRouter();

  useTVNavigation({
    onBack: () => router.back(),
  });

  return null;
}
