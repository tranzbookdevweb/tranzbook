import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { PenBox, Trash } from "lucide-react"; 
  import { useRouter } from "next/navigation";
  import React from "react";
  
  interface ActionButtonProps {
    id: string; 
    onSuccess: () => void; // Callback to refresh roles data
  }
  
  export function Actionbutton({ id, onSuccess }: ActionButtonProps) {
    const router = useRouter();
  
    const handleEdit = () => {
      router.push(`/admin/Roles/edit?id=${id}`); // Navigate to the role edit page
    };
  
    const handleDelete = async () => {
      try {
        const response = await fetch(`/api/DELETE/Role/deleteById?id=${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete role");
        }
  
        alert("Role deleted successfully");
        onSuccess(); // Trigger refresh of the roles list
      } catch (error) {
        console.error("Failed to delete role:", error);
        alert("Failed to delete role. Please try again.");
      }
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <PenBox className="hover:cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuItem
            className="hover:cursor-pointer hover:bg-gray-50"
            onClick={handleEdit}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 hover:bg-gray-50 hover:cursor-pointer font-semibold"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  