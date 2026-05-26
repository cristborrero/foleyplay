import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret');
    let isSuperAdmin = false;

    if (secret === process.env.ADMIN_SECRET) {
      isSuperAdmin = true;
    } else {
      const session = await auth();
      isSuperAdmin = session?.user?.role === 'superadmin';
    }

    if (!isSuperAdmin) {
      return NextResponse.json({ message: 'Solo el superadmin puede designar admins' }, { status: 403 });
    }

    const { email, makeAdmin } = await req.json();
    if (!email || typeof makeAdmin !== 'boolean') {
      return NextResponse.json({ message: 'Parámetros inválidos' }, { status: 400 });
    }

    const db = getDb();
    const [target] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!target) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    if ((target.role || 'user') === 'superadmin') {
      return NextResponse.json({ message: 'No se puede modificar al superadmin' }, { status: 403 });
    }

    const update = makeAdmin
      ? { role: 'admin' as const, approved: true }
      : { role: 'user' as const };

    await db.update(users).set(update).where(eq(users.email, email));
    return NextResponse.json({ message: 'Rol actualizado' });
  } catch (error) {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
