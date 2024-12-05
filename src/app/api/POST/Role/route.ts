import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const permissionNames = [
  "Dashboard",
  "Configurations",
  "Companies",
  "Branches",
  "Master Data",
  "Buses",
  "Country",
  "Service Locations",
  "Manage Drivers",
  "Drivers",
  "Trips",
  "Roles",
  "Admins",
  "Trip Requests",
  "Completed Trips",
  "Scheduled Trips",
  "Cancelled Trips",
  "Manage Users",
  "Approved Users",
  "Approve Pending Users",
  "Suspended Users",
  "Deactivated Users",
  "Deleted Users",
  "Blog Posts",
  "Chat",
  "Notification",
  "Promo Code",
  "Complaints",
  "User Complaint",
  "Driver Complaint",
  "Reports",
  "User Report",
  "Driver Report",
  "Finance Report",
];

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    // Ensure the role name is provided
    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    // Create the new role
    const newRole = await prisma.role.create({
      data: {
        name,
        permissions: {
          create: permissionNames.map(permissionName => ({
            name: permissionName,
            canCreate: false,
            canRead: false,
            canUpdate: false,
            canDelete: false,
          })),
        },
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "An error occurred while creating the role" }, { status: 500 });
  }
}
