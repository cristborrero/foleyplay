import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { history } from '@/db/schema';
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
      .from(history)
      .where(eq(history.userId, session.user.id))
      .orderBy(desc(history.watchedAt))
      .limit(50);

    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ message: 'Error fetching history' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const { tmdbId, mediaType, title, posterPath, progress, season, episode } = await req.json();

    if (!tmdbId || !mediaType) {
      return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
    }

    const db = getDb();

    // Check if it already exists
    const [existing] = await db.select()
      .from(history)
      .where(and(
        eq(history.userId, session.user.id),
        eq(history.tmdbId, Number(tmdbId)),
        eq(history.mediaType, mediaType)
      ))
      .limit(1);

    if (existing) {
      // Update progress
      const [updated] = await db.update(history)
        .set({
          progress: progress !== undefined ? Number(progress) : existing.progress,
          season: season !== undefined ? Number(season) : existing.season,
          episode: episode !== undefined ? Number(episode) : existing.episode,
          watchedAt: new Date()
        })
        .where(eq(history.id, existing.id))
        .returning();
      
      return NextResponse.json({ message: 'Historial actualizado', history: updated });
    }

    const newId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2);

    // Create new history entry
    const [newHistory] = await db.insert(history).values({
      id: newId,
      userId: session.user.id,
      tmdbId: Number(tmdbId),
      mediaType,
      title,
      posterPath,
      progress: progress !== undefined ? Number(progress) : 0,
      season: season !== undefined ? Number(season) : null,
      episode: episode !== undefined ? Number(episode) : null
    }).returning();

    return NextResponse.json({ message: 'Añadido al historial', history: newHistory }, { status: 201 });
  } catch (error) {
    console.error('Error updating history:', error);
    return NextResponse.json({ message: 'Error actualizando el historial' }, { status: 500 });
  }
}