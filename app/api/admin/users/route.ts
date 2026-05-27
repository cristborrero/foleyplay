import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';


async function getRequesterRole(req: NextRequest): Promise<{ email: string | null; role: string }> {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret === process.env.ADMIN_SECRET) {
    return { email: process.env.ADMIN_EMAIL ?? null, role: 'superadmin' };
  }
  const session = await auth();
  return {
    email: session?.user?.email ?? null,
    role: session?.user?.role ?? 'user',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { role } = await getRequesterRole(req);
    if (role !== 'admin' && role !== 'superadmin') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const db = getDb();
    const userList = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      approved: users.approved,
      role: users.role,
      createdAt: users.createdAt,
    })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json(userList);
  } catch (error) {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const requester = await getRequesterRole(req);
    if (requester.role !== 'admin' && requester.role !== 'superadmin') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email requerido' }, { status: 400 });
    }

    const db = getDb();
    const [target] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!target) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const targetRole = target.role || 'user';

    // Superadmin is always protected — nobody can delete it through this endpoint
    if (targetRole === 'superadmin') {
      return NextResponse.json({ message: 'No se puede eliminar al superadmin' }, { status: 403 });
    }

    // Only superadmin can delete other admins
    if (targetRole === 'admin' && requester.role !== 'superadmin') {
      return NextResponse.json({ message: 'Solo el superadmin puede eliminar admins' }, { status: 403 });
    }

    await db.delete(users).where(eq(users.email, email));
    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
