import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startCityId = searchParams.get('start');
    const endCityId = searchParams.get('end');

    if (!startCityId || !endCityId) {
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    const route = await prisma.route.findFirst({
      where: {
        startCityId,
        endCityId,
      },
      select: {
        duration: true,
        distance: true,
      },
    });

    if (!route) {
      return NextResponse.json({ message: 'Route not found' }, { status: 404 });
    }

    return NextResponse.json(route, { status: 200 });
  } catch (error) {
    console.error('Error fetching route details:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
