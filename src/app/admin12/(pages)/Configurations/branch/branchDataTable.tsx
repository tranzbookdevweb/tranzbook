'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
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
import BranchSheet from '@/app/admin12/components/Sheetpop/Priveleges/BranchSheet';

interface Branch {
  id: string;
  name: string;
  address: string;
  phoneNumber: string | null;
  city: string;
  companyId: string;
  company: {
    name: string;
  };
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
  const [editData, setEditData] = useState<{ name?: string; address?: string }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

  // Refs for input fields to maintain focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Memoized input components to prevent re-renders
  const EditableNameCell = React.memo(({ branch, isEditing }: { branch: Branch; isEditing: boolean }) => {
    if (isEditing) {
      return (
        <Input
          key={`name-${branch.id}`}
          value={editData.name !== undefined ? editData.name : branch.name}
          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSaveEdit(branch.id);
            } else if (e.key === 'Escape') {
              handleCancelEdit();
            }
          }}
          className="w-full"
        />
      );
    }
    return <div>{branch.name}</div>;
  });

  const EditableAddressCell = React.memo(({ branch, isEditing }: { branch: Branch; isEditing: boolean }) => {
    if (isEditing) {
      return (
        <Input
          key={`address-${branch.id}`}
          value={editData.address !== undefined ? editData.address : branch.address}
          onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSaveEdit(branch.id);
            } else if (e.key === 'Escape') {
              handleCancelEdit();
            }
          }}
          className="w-full"
        />
      );
    }
    return <div>{branch.address}</div>;
  });

  EditableNameCell.displayName = 'EditableNameCell';
  EditableAddressCell.displayName = 'EditableAddressCell';

  // Move function definitions before columns
  const handleCancelEdit = useCallback(() => {
    setEditingRow(null);
    setEditData({});
  }, []);

  const handleEdit = useCallback((id: string) => {
    const branch = data.find(b => b.id === id);
    if (branch) {
      setEditingRow(id);
      setEditData({
        name: branch.name,
        address: branch.address
      });
    }
  }, [data]);

  const handleDeleteClick = useCallback((id: string) => {
    setBranchToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async (id: string) => {
    try {
      const originalBranch = data.find(branch => branch.id === id);
      if (!originalBranch) return;
      
      const updatePayload = {
        name: editData.name !== undefined ? editData.name : originalBranch.name,
        address: editData.address !== undefined ? editData.address : originalBranch.address,
        phoneNumber: originalBranch.phoneNumber,
        city: originalBranch.city,
        companyId: originalBranch.companyId
      };
      
      const response = await fetch(`/api/GET/getBranches?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update branch');
      }

      setEditingRow(null);
      setEditData({});
      await fetchBranches();
      
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
  }, [data, editData]);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await fetch('/api/GET/getBranches');
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast({
        title: "Error",
        description: "Failed to fetch branches",
        variant: "destructive",
      });
    }
  }, []);

  // Define columns for Branch data
  const columns: ColumnDef<Branch>[] = React.useMemo(() => [
    {
      accessorKey: "Sno",
      header: "Sr No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: "Branch Name",
      cell: ({ row }) => {
        const branch = row.original;
        const isEditing = editingRow === branch.id;
        return <EditableNameCell branch={branch} isEditing={isEditing} />;
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const branch = row.original;
        const isEditing = editingRow === branch.id;
        return <EditableAddressCell branch={branch} isEditing={isEditing} />;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => {
        const branch = row.original;
        return <div>{branch.phoneNumber || 'N/A'}</div>;
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => {
        const branch = row.original;
        return <div>{branch.city}</div>;
      },
    },
    {
      id: "companyName",
      header: "Company",
      accessorFn: (row) => row.company.name,
      cell: ({ row }) => <div>{row.original.company.name}</div>,
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
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleCancelEdit()}
              >
                Cancel
              </Button>
            </div>
          );
        }
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
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
  ], [editingRow, editData, handleSaveEdit, handleCancelEdit, handleEdit, handleDeleteClick]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleAddSuccess = () => {
    fetchBranches();
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

      await fetchBranches();
      
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
    <div>
      <BranchSheet onAddSuccess={handleAddSuccess} />
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by Branch Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableCaption>All available branches</TableCaption>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this branch? This action cannot be undone if the branch has no associated admins or routes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BranchDataTable;