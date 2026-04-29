import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

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

    await dbConnect();
    const target = await User.findOne({ email }).lean();
    if (!target) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    if ((target.role || 'user') === 'superadmin') {
      return NextResponse.json({ message: 'No se puede modificar al superadmin' }, { status: 403 });
    }

    const update = makeAdmin
      ? { role: 'admin', approved: true }
      : { role: 'user' };

    await User.findOneAndUpdate({ email }, update);
    return NextResponse.json({ message: 'Rol actualizado' });
  } catch {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
