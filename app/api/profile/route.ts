import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    await dbConnect();
    const user = await User.findById(session.user.id).select('name email image');
    if (!user) return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    return NextResponse.json({ name: user.name, email: user.email, image: user.image ?? null });
  } catch {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    const { name } = await req.json();
    if (!name?.trim() || name.trim().length > 100) return NextResponse.json({ message: 'Nombre inválido' }, { status: 400 });
    await dbConnect();
    await User.findByIdAndUpdate(session.user.id, { name: name.trim() });
    return NextResponse.json({ message: 'Perfil actualizado' });
  } catch {
    return NextResponse.json({ message: 'Error actualizando perfil' }, { status: 500 });
  }
}
