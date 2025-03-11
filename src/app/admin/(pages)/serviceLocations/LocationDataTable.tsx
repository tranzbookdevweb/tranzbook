'use client';

import React, { useState, useEffect } from 'react';
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
import ServiceLocation from '../../components/Sheetpop/serviceLocations/serviceLocationsSheet';

interface City {
  id: string;
  name: string;
  imageUrl: string | null;
  country: string;
  currency: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phoneNumber: string | null;
  city: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface RouteData {
  id: string;
  duration: number;
  distance: number;
  startCity: City;
  endCity: City;
  branch: Branch;
}

export function Location() {
  const [data, setData] = useState<RouteData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<RouteData>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  // Define columns with the new actions column
  const columns: ColumnDef<RouteData>[] = [
    {
      accessorKey: "Sno",
      header: "Sr No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "startCity.name",
      header: "Start Location",
      cell: ({ row }) => <div>{row.original.startCity.name}</div>,
    },
    {
      accessorKey: "endCity.name",
      header: "End Location",
      cell: ({ row }) => <div>{row.original.endCity.name}</div>,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const route = row.original;
        const isEditing = editingRow === route.id;
        
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editData.duration !== undefined ? editData.duration : route.duration}
              onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
              className="w-full"
            />
          );
        }
        return <div>{route.duration} minutes</div>;
      },
    },
    {
      accessorKey: "distance",
      header: "Distance",
      cell: ({ row }) => {
        const route = row.original;
        const isEditing = editingRow === route.id;
        
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editData.distance !== undefined ? editData.distance : route.distance}
              onChange={(e) => setEditData({ ...editData, distance: parseInt(e.target.value) })}
              className="w-full"
            />
          );
        }
        return <div>{route.distance} km</div>;
      },
    },
    {
      id: "branchName", // Use a simple ID
      header: "Company",
      accessorFn: (row) => row.branch.name, // Use accessorFn for nested properties
      cell: ({ row }) => <div>{row.original.branch.name}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const route = row.original;
        const isEditing = editingRow === route.id;
        
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="default" 
                onClick={() => handleSaveEdit(route.id)}
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
                onClick={() => handleEdit(route.id)}
                className="flex items-center cursor-pointer"
              >
                <Pencil2Icon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(route.id)}
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

  const fetchServiceLocations = async () => {
    try {
      const response = await fetch('/api/GET/getServicelocations');
      if (!response.ok) {
        throw new Error('Failed to fetch service locations');
      }
      const result = await response.json();
      setData(result.routes);
    } catch (error) {
      console.error('Error fetching service locations:', error);
    }
  };

  useEffect(() => {
    fetchServiceLocations();
  }, []);

  const handleAddSuccess = () => {
    fetchServiceLocations();
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      // Create the updated route data by merging the original data with edited data
      const originalRoute = data.find(route => route.id === id);
      if (!originalRoute) return;
      
      const updatedRoute = { ...originalRoute, ...editData };
      
      // Make the API call to update
      const response = await fetch(`/api/PUT/updateRoutes?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoute),
      });

      if (!response.ok) {
        throw new Error('Failed to update route');
      }

      // Reset editing state
      setEditingRow(null);
      setEditData({});
      
      // Refresh data
      fetchServiceLocations();
      
      toast({
        title: "Success",
        description: "Route updated successfully",
      });
    } catch (error) {
      console.error('Error updating route:', error);
      toast({
        title: "Error",
        description: "Failed to update route",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setRouteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!routeToDelete) return;
    
    try {
      const response = await fetch(`/api/DELETE/deleteRoutes?id=${routeToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete route');
      }

      // Refresh data
      fetchServiceLocations();
      
      toast({
        title: "Success",
        description: "Route deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setRouteToDelete(null);
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
      <ServiceLocation onAddSuccess={handleAddSuccess} />
      <div className="w-full">
        <div className="flex items-center py-4">
        <Input
  placeholder="Filter by Company..."
  value={(table.getColumn("branchName")?.getFilterValue() as string) ?? ""}
  onChange={(event) => table.getColumn("branchName")?.setFilterValue(event.target.value)}
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
            <TableCaption>All available service routes</TableCaption>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Route</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this route? This action cannot be undone.
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

export default Location;