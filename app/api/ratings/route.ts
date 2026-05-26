import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ratings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ score: null });
    const tmdbId = parseInt(req.nextUrl.searchParams.get('tmdbId') || '');
    const mediaType = req.nextUrl.searchParams.get('mediaType');
    if (!tmdbId || !mediaType || !['movie', 'tv'].includes(mediaType)) return NextResponse.json({ score: null });
    
    const db = getDb();
    const [rating] = await db.select()
      .from(ratings)
      .where(and(
        eq(ratings.userId, session.user.id),
        eq(ratings.tmdbId, tmdbId),
        eq(ratings.mediaType, mediaType as 'movie' | 'tv')
      ))
      .limit(1);
    return NextResponse.json({ score: rating?.score ?? null });
  } catch {
    return NextResponse.json({ score: null });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
    const { tmdbId: rawId, mediaType, score } = await req.json();
    const tmdbId = parseInt(rawId);
    if (!tmdbId || !['movie', 'tv'].includes(mediaType) || score === undefined) {
      return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
    }
    
    const db = getDb();
    const [existing] = await db.select()
      .from(ratings)
      .where(and(
        eq(ratings.userId, session.user.id),
        eq(ratings.tmdbId, tmdbId),
        eq(ratings.mediaType, mediaType as 'movie' | 'tv')
      ))
      .limit(1);

    if (existing) {
      await db.update(ratings)
        .set({ score: Number(score), ratedAt: new Date() })
        .where(eq(ratings.id, existing.id));
      return NextResponse.json({ message: 'Calificación actualizada' });
    }

    const newId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    await db.insert(ratings).values({
      id: newId,
      userId: session.user.id,
      tmdbId,
      mediaType: mediaType as 'movie' | 'tv',
      score: Number(score)
    });
    return NextResponse.json({ message: 'Calificación añadida' }, { status: 201 });
  } catch (error) {
    console.error('Error rating media:', error);
    return NextResponse.json({ message: 'Error actualizando calificación' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    const tmdbId = parseInt(req.nextUrl.searchParams.get('tmdbId') || '');
    const mediaType = req.nextUrl.searchParams.get('mediaType');
    if (!tmdbId || !mediaType) return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
    
    const db = getDb();
    await db.delete(ratings)
      .where(and(
        eq(ratings.userId, session.user.id),
        eq(ratings.tmdbId, tmdbId),
        eq(ratings.mediaType, mediaType as 'movie' | 'tv')
      ));
    return NextResponse.json({ message: 'Calificación eliminada' });
  } catch {
    return NextResponse.json({ message: 'Error eliminando calificación' }, { status: 500 });
  }
}
