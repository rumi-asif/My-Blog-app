import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, bio, website, interests } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: role || 'READER',
        bio,
        website,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

