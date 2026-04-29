import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { History } from '@/models/History';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const history = await History.find({ userId: session.user.id }).sort({ watchedAt: -1 }).limit(50);

    return NextResponse.json(history);
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

    const { tmdbId, mediaType, title, posterPath, progress, duration, season, episode } = await req.json();

    if (!tmdbId || !mediaType) {
      return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
    }

    await dbConnect();

    // Check if it already exists
    const existing = await History.findOne({
      userId: session.user.id,
      tmdbId,
      mediaType
    });

    if (existing) {
      // Update progress
      existing.progress = progress || existing.progress;
      existing.season = season || existing.season;
      existing.episode = episode || existing.episode;
      existing.watchedAt = new Date();
      await existing.save();
      
      return NextResponse.json({ message: 'Historial actualizado', history: existing });
    }

    // Create new history entry
    const newHistory = await History.create({
      userId: session.user.id,
      tmdbId,
      mediaType,
      title,
      posterPath,
      progress: progress || 0,
      season,
      episode
    });

    return NextResponse.json({ message: 'Añadido al historial', history: newHistory }, { status: 201 });
  } catch (error) {
    console.error('Error updating history:', error);
    return NextResponse.json({ message: 'Error actualizando el historial' }, { status: 500 });
  }
}