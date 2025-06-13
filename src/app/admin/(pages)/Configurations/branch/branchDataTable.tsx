'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  CaretSortIcon,
  ChevronDownIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import BranchSheet from '@/app/admin/components/Sheetpop/Priveleges/BranchSheet';

// Updated interface to match the database schema
interface Branch {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  city: string;
  companyId: string;
  company?: {
    id: string;
    name: string;
    email: string;
    logo?: string;
  };
  admins?: any[];
  routes?: any[];
  createdAt: string;
  updatedAt: string;
}

export function BranchDataTable() {
  const [data, setData] = useState<Branch[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Branch>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getBranches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/GET/getBranches');
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      const data = await response.json();
      setData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast({
        title: "Error",
        description: "Failed to fetch branches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBranches();
  }, [getBranches]);

  const handleAddSuccess = () => {
    getBranches();
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const originalBranch = data.find(branch => branch.id === id);
      if (!originalBranch) return;
      
      // Create the updated branch data, ensuring required fields are present
      const updatedBranch = {
        name: editData.name !== undefined ? editData.name : originalBranch.name,
        address: editData.address !== undefined ? editData.address : originalBranch.address,
        phoneNumber: editData.phoneNumber !== undefined ? editData.phoneNumber : originalBranch.phoneNumber,
        city: editData.city !== undefined ? editData.city : originalBranch.city,
        companyId: editData.companyId !== undefined ? editData.companyId : originalBranch.companyId,
      };

      // Validate required fields
      if (!updatedBranch.name || !updatedBranch.address || !updatedBranch.city || !updatedBranch.companyId) {
        toast({
          title: "Error",
          description: "Name, address, city, and company are required fields",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(`/api/GET/getBranches?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBranch),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update branch');
      }

      // Reset editing state
      setEditingRow(null);
      setEditData({});
      
      // Refresh data
      getBranches();
      
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
    } catch (error) {
      console.error('Error updating branch:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update branch",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setBranchToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!branchToDelete) return;
    
    try {
      const response = await fetch(`/api/GET/getBranches?id=${branchToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete branch');
      }

      // Refresh data
      getBranches();
      
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete branch",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBranchToDelete(null);
    }
  };

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "Sno",
      header: "Sr No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const branch = row.original;
        const isEditing = editingRow === branch.id;
        
        if (isEditing) {
          return (
            <Input
              value={editData.name !== undefined ? editData.name : branch.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full"
              placeholder="Branch name"
            />
          );
        }
        return <div className="font-medium">{branch.name}</div>;
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const branch = row.original;
        const isEditing = editingRow === branch.id;
        
        if (isEditing) {
          return (
            <Input
              value={editData.address !== undefined ? editData.address : branch.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              className="w-full"
              placeholder="Branch address"
            />
          );
        }
        return <div className="max-w-[200px] truncate">{branch.address}</div>;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => {
        const branch = row.original;
        const isEditing = editingRow === branch.id;
        
        if (isEditing) {
          return (
            <Input
              value={editData.phoneNumber !== undefined ? editData.phoneNumber : (branch.phoneNumber || '')}
              onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
              className="w-full"
              placeholder="Phone number"
            />
          );
        }
        return <div>{branch.phoneNumber || 'N/A'}</div>;
      },
    },
    {
      accessorKey: "city",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            City
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const branch = row.original;
        const isEditing = editingRow === branch.id;
        
        if (isEditing) {
          return (
            <Input
              value={editData.city !== undefined ? editData.city : branch.city}
              onChange={(e) => setEditData({ ...editData, city: e.target.value })}
              className="w-full"
              placeholder="City"
            />
          );
        }
        return <div>{branch.city}</div>;
      },
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => {
        const branch = row.original;
        return <div className="font-medium">{branch.company?.name || 'N/A'}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const branch = row.original;
        const isEditing = editingRow === branch.id;
        
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="default" 
                onClick={() => handleSaveEdit(branch.id)}
                disabled={loading}
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setEditingRow(null);
                  setEditData({});
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          );
        }
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={loading}>
                Actions
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => handleEdit(branch.id)}
                className="flex items-center cursor-pointer"
              >
                <Pencil2Icon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(branch.id)}
                className="flex items-center cursor-pointer text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <BranchSheet onAddSuccess={handleAddSuccess} />
      <div className="w-full">
        <div className="flex items-center py-4 space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Filter by city..."
            value={(table.getColumn("city")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("city")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {loading ? "Loading branches..." : "A list of all branches."}
            </TableCaption>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
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
                    {loading ? "Loading..." : "No branches found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this branch? This action cannot be undone.
              {data.find(b => b.id === branchToDelete)?.admins?.length ? 
                " Note: This branch has associated admins that must be reassigned first." : ""}
              {data.find(b => b.id === branchToDelete)?.routes?.length ? 
                " Note: This branch has associated routes that must be removed first." : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BranchDataTable;