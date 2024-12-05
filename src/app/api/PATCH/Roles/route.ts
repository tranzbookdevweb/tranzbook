// Define the Permission type
interface Permission {
    id: string;
    name: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  }
  
  import prisma from "@/app/lib/db";
  import { NextResponse } from "next/server";
  
  // PATCH request to update a role along with its permissions
  export async function PATCH(request: Request) {
    try {
      const { id, name, permissions } = await request.json(); // Get the data from the request body
  
      if (!id || !name || !permissions) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      // Update the role in the database
      const updatedRole = await prisma.role.update({
        where: { id },
        data: {
          name,
          permissions: {
            // Update each permission for the role
            update: permissions.map((permission: Permission) => ({
              where: { id: permission.id },
              data: {
                canCreate: permission.canCreate,
                canRead: permission.canRead,
                canUpdate: permission.canUpdate,
                canDelete: permission.canDelete,
              },
            })),
          },
        },
        include: {
          permissions: true, // Include updated permissions in the response
        },
      });
  
      return NextResponse.json(updatedRole, { status: 200 });
    } catch (error) {
      console.error("Error updating role:", error);
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }
  }
  