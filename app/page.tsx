import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const runtime = 'edge';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/browse');
  } else {
    redirect('/login');
  }
}
