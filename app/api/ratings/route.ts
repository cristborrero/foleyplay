import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Rating } from '@/models/Rating';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ score: null });
    const tmdbId = parseInt(req.nextUrl.searchParams.get('tmdbId') || '');
    const mediaType = req.nextUrl.searchParams.get('mediaType');
    if (!tmdbId || !mediaType) return NextResponse.json({ score: null });
    await dbConnect();
    const rating = await Rating.findOne({ userId: session.user.id, tmdbId, mediaType });
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
    await dbConnect();
    const existing = await Rating.findOne({ userId: session.user.id, tmdbId, mediaType });
    if (existing) {
      existing.score = score;
      await existing.save();
      return NextResponse.json({ message: 'Calificación actualizada' });
    }
    await Rating.create({ userId: session.user.id, tmdbId, mediaType, score });
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
    await dbConnect();
    await Rating.deleteOne({ userId: session.user.id, tmdbId, mediaType });
    return NextResponse.json({ message: 'Calificación eliminada' });
  } catch {
    return NextResponse.json({ message: 'Error eliminando calificación' }, { status: 500 });
  }
}
