import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Watchlist } from '@/models/Watchlist';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const watchlist = await Watchlist.find({ userId: session.user.id }).sort({ addedAt: -1 });

    return NextResponse.json(watchlist);
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

    await dbConnect();

    // Check if it already exists
    const existing = await Watchlist.findOne({
      userId: session.user.id,
      tmdbId,
      mediaType
    });

    if (existing) {
      // Remove if it exists (Toggle functionality)
      await Watchlist.deleteOne({ _id: existing._id });
      return NextResponse.json({ message: 'Removido de la lista', added: false });
    }

    // Add if it doesn't exist
    await Watchlist.create({
      userId: session.user.id,
      tmdbId,
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