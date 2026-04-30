'use client';

import { useIsTV } from '@/lib/tv-context';
import TVBrowse from './TVBrowse';

export default function TVBrowseSwitch({ webContent }: { webContent: React.ReactNode }) {
  const isTV = useIsTV();
  if (isTV) return <TVBrowse />;
  return <>{webContent}</>;
}
