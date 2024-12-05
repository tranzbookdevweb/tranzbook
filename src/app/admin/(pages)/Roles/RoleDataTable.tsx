"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RoleSheet from "../../components/Sheetpop/Roles/RoleSheet";
import { Actionbutton } from "./Action";

interface Role {
  id: string;
  name: string;
}

export function RoleDataTable() {
  const [data, setData] = useState<Role[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch roles from the API
  const getRoles = useCallback(async () => {
    try {
      const response = await fetch("/api/GET/getRoles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const roles = await response.json();
      setData(Array.isArray(roles) ? roles : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const handleAddSuccess = () => {
    getRoles();
  };

  // Define table columns
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "Sno",
      header: "Sr No",
      cell: ({ row }) => <div>{row.index + 1}</div>, // Use row index as Sno value
    },
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const role = row.original; // Access the current row data
        return (
          <Actionbutton
            id={role.id}
            onSuccess={getRoles} // Refresh roles on success (e.g., after delete)
          />
        );
      },
    }
    
  ];

  // React Table instance
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <RoleSheet onAddSuccess={handleAddSuccess} />
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by Role Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of roles.</TableCaption>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RoleDataTable;
