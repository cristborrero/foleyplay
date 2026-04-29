import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== 'admin' && role !== 'superadmin') {
    redirect('/');
  }

  return (
    <AdminUsersClient
      currentUserRole={role}
      currentUserEmail={session?.user?.email ?? ''}
    />
  );
}
