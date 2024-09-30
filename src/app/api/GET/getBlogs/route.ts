import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const 
    Blog = await prisma.blog.findMany();
    return NextResponse.json(Blog, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching Blogs' }, { status: 500 });
  }
}
