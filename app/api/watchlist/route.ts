import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { watchlist } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const db = getDb();
    const list = await db.select()
      .from(watchlist)
      .where(eq(watchlist.userId, session.user.id))
      .orderBy(desc(watchlist.addedAt));

    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ message: 'Error fetching watchlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const { tmdbId, mediaType, title, posterPath } = await req.json();

    if (!tmdbId || !mediaType) {
      return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
    }

    const db = getDb();

    // Check if it already exists
    const [existing] = await db.select()
      .from(watchlist)
      .where(and(
        eq(watchlist.userId, session.user.id),
        eq(watchlist.tmdbId, Number(tmdbId)),
        eq(watchlist.mediaType, mediaType)
      ))
      .limit(1);

    if (existing) {
      // Remove if it exists (Toggle functionality)
      await db.delete(watchlist).where(eq(watchlist.id, existing.id));
      return NextResponse.json({ message: 'Removido de la lista', added: false });
    }

    const newId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2);

    // Add if it doesn't exist
    await db.insert(watchlist).values({
      id: newId,
      userId: session.user.id,
      tmdbId: Number(tmdbId),
      mediaType,
      title,
      posterPath
    });

    return NextResponse.json({ message: 'Añadido a la lista', added: true });
  } catch (error) {
    console.error('Error toggling watchlist:', error);
    return NextResponse.json({ message: 'Error actualizando la lista' }, { status: 500 });
  }
}