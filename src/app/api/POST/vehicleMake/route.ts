import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // Extract form data
    const formData = await req.formData();
    const plateNumber = formData.get("plateNumber") as string;
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const busModel = formData.get("busModel") as string;
    const companyId = formData.get("companyId") as string;
    const image = formData.get("image") as File;

    // Extract all boolean extras dynamically
    const extras = [
      "airConditioning",
      "chargingOutlets",
      "wifi",
      "restRoom",
      "seatBelts",
      "onboardFood",
    ];

    const busExtras = extras.reduce((acc, extra) => {
      // Convert the form data to boolean
      acc[extra] = formData.get(extra) === "true";
      return acc;
    }, {} as Record<string, boolean>);

    // Validate required fields
    if (!plateNumber || !capacity || !busModel || !companyId || !image) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Upload image to Supabase storage
    const { data: imageData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(`buses/${image.name}-${Date.now()}`, image, {
        cacheControl: "2592000",
        contentType: image.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Create a new bus record including the dynamic boolean extras
    const newBus = await prisma.bus.create({
      data: {
        plateNumber,
        capacity,
        busModel,
        companyId,
        image: imageData?.path,  // Store the image path in Prisma
        status: "available",     // Set the default status to "available"
        ...busExtras,            // Dynamically include the boolean extras
      },
    });

    return NextResponse.json(newBus, { status: 201 });
  } catch (error) {
    console.error("Error creating bus:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
