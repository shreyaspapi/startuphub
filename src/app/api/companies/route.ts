// @ts-nocheck
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 30;
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'semrushGlobalRank';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  try {
    const where = search ? {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    } : {};

    const orderBy = sortBy === 'semrushGlobalRank'
      ? {
          semrushGlobalRank: {
            // Sort as numbers, with nulls last
            sort: sortOrder,
            nulls: 'last',
          },
        }
      : { [sortBy]: sortOrder };

    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
      }),
      prisma.company.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      companies,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'An error occurred while fetching companies' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
