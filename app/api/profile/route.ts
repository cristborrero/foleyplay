import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';


export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    
    const db = await getDb();
    const [user] = await db.select({
      name: users.name,
      email: users.email,
      image: users.image,
    }).from(users).where(eq(users.id, session.user.id)).limit(1);

    if (!user) return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    return NextResponse.json({ name: user.name, email: user.email, image: user.image ?? null });
  } catch (error) {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    
    const { name } = await req.json();
    if (!name?.trim() || name.trim().length > 100) return NextResponse.json({ message: 'Nombre inválido' }, { status: 400 });

    const db = await getDb();
    await db.update(users).set({ name: name.trim() }).where(eq(users.id, session.user.id));
    return NextResponse.json({ message: 'Perfil actualizado' });
  } catch (error) {
    return NextResponse.json({ message: 'Error actualizando perfil' }, { status: 500 });
  }
}
