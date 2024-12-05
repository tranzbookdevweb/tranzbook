import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const logo = formData.get('logo') as File;

    if (!name || !email  || !logo) {
      return NextResponse.json({ error: "Name, email, password, and logo are required" }, { status: 400 });
    }


    const { data: imageData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(`/logos/${logo.name}-${Date.now()}`, logo, {
        cacheControl: '2592000',
        contentType: logo.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const newBusCompany = await prisma.busCompany.create({
      data: {
        name,
        email,
        logo: imageData?.fullPath,
      },
    });

    return NextResponse.json(newBusCompany, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the bus company' }, { status: 500 });
  }
}
