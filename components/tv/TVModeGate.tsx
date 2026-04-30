'use client';

import { useIsTV } from '@/lib/tv-context';
import TVLayout from './TVLayout';

interface TVModeGateProps {
  children: React.ReactNode;
  webWrapper: React.ReactNode;
}

export default function TVModeGate({ children, webWrapper }: TVModeGateProps) {
  const isTV = useIsTV();

  if (isTV) {
    return <TVLayout>{children}</TVLayout>;
  }

  return <>{webWrapper}</>;
}
