import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret !== process.env.ADMIN_SECRET) {
      const session = await auth();
      if (!isAdmin(session?.user?.email)) {
        return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
      }
    }

    const { email, approved } = await req.json();
    if (!email || typeof approved !== 'boolean') {
      return NextResponse.json({ message: 'Parámetros inválidos' }, { status: 400 });
    }

    await dbConnect();
    const result = await User.findOneAndUpdate(
      { email },
      { approved },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Actualizado', approved: result.approved });
  } catch {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
