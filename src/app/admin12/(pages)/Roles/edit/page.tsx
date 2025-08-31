'use client';
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Permission {
  id: string;
  name: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

const EditRolePageContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState<string>(""); 
  const [saving, setSaving] = useState<boolean>(false);
  const { toast } = useToast(); 
  const [selectAll, setSelectAll] = useState<boolean>(false); // State to track select all checkbox

  useEffect(() => {
    const fetchRole = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/GET/getRoleById?id=${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch role");
          }
          const data = await response.json();
          setRole(data);
          setName(data.name); 
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };

    fetchRole();
  }, [id]);

  const handleCheckboxChange = (permissionId: string, permissionKey: keyof Permission) => {
    if (role) {
      const updatedPermissions = role.permissions.map((permission) => {
        if (permission.id === permissionId) {
          return {
            ...permission,
            [permissionKey]: !permission[permissionKey],
          };
        }
        return permission;
      });
      setRole({ ...role, permissions: updatedPermissions });
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (role) {
      const updatedPermissions = role.permissions.map((permission) => ({
        ...permission,
        canCreate: !selectAll,
        canRead: !selectAll,
        canUpdate: !selectAll,
        canDelete: !selectAll,
      }));
      setRole({ ...role, permissions: updatedPermissions });
    }
  };

  const handleSave = async () => {
    if (!name) {
      alert("Role name is required");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/PATCH/Roles`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, permissions: role?.permissions }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      toast({
        title: "Role Updated",
        description: "The role has been updated successfully.",
        action: (
          <ToastAction altText="Go to Roles">Go to Roles</ToastAction>
        ),
      });
      window.location.href = "/admin/Roles"; 
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update role. Please try again.",
        action: (
          <ToastAction altText="Retry">Retry</ToastAction>
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  if (!role) {
    return <div>Role not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Edit Role</h1>
      <div className="mt-4">
        <div>
          <label htmlFor="roleName" className="block text-sm font-medium">
            Role Name
          </label>
          <Input
            id="roleName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Permissions</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="mr-2"
              />
              <span>Select All</span>
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full mt-2">
            {role.permissions.map((permission) => (
              <AccordionItem key={permission.id} value={permission.id}>
                <AccordionTrigger>{permission.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permission.canCreate}
                        onChange={() => handleCheckboxChange(permission.id, "canCreate")}
                      />
                      <span className="ml-2">Create</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permission.canRead}
                        onChange={() => handleCheckboxChange(permission.id, "canRead")}
                      />
                      <span className="ml-2">Read</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permission.canUpdate}
                        onChange={() => handleCheckboxChange(permission.id, "canUpdate")}
                      />
                      <span className="ml-2">Update</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permission.canDelete}
                        onChange={() => handleCheckboxChange(permission.id, "canDelete")}
                      />
                      <span className="ml-2">Delete</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const EditRolePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditRolePageContent />
  </Suspense>
);

export default EditRolePage;
