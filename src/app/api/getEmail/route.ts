import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Disable caching for this route
  const noStoreHeaders = new Headers({
    "Cache-Control": "no-store",
  });

  try {
    // Retrieve the user's session and email
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User not authenticated or email not found" },
        { status: 401, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      { email: user.email },
      { status: 200, headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Error fetching user email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
