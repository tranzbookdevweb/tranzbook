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
import TripSheet from '../../components/Sheetpop/Trips/TripSheet';

// Updated type definitions to match the new API response
type TripData = {
  id: string;
  date: string | null;
  recurring: boolean;
  daysOfWeek: number[];
  price: number;
  currency: string;
  commission: number;
  commissionType: string;
  departureTime: string;
  busId: string;
  routeId: string;
  driverId: string | null;
  createdAt: string;
  updatedAt: string;
  bus: {
    busDescription: string;
    company: {
      name: string;
    };
  };
  route: {
    startCity: {
      name: string;
    };
    endCity: {
      name: string;
    };
  };
};

export function Trip() {
  const [data, setData] = useState<TripData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TripData>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  // Define columns with the new action column
  const columns: ColumnDef<TripData>[] = [
    {
      accessorKey: "Sno",
      header: "Sr No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
  
    {
      accessorKey: "departureTime",
      header: "Departure Time",
      cell: ({ row }) => {
        const isEditing = editingRow === row.original.id;
        if (isEditing) {
          return (
            <Input
              type="time"
              value={editData.departureTime || row.getValue("departureTime")}
              onChange={(e) => setEditData({ ...editData, departureTime: e.target.value })}
              className="w-full"
            />
          );
        }
        return <div>{row.getValue("departureTime")}</div>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const trip = row.original;
        const isEditing = editingRow === trip.id;
        
        if (isEditing) {
          return (
            <div className="flex gap-2">
              <Input
                type="number"
                value={editData.price !== undefined ? editData.price : trip.price}
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                className="w-20"
              />
              <Input
                value={editData.currency || trip.currency}
                onChange={(e) => setEditData({ ...editData, currency: e.target.value })}
                className="w-16"
              />
            </div>
          );
        }
        return <div>{trip.price} {trip.currency}</div>;
      },
    },
    {
      accessorKey: "bus.busDescription",
      header: "Bus Type",
      cell: ({ row }) => <div>{row.original.bus.busDescription}</div>,
    },
    {
      accessorKey: "bus.company.name",
      header: "Company",
      cell: ({ row }) => <div>{row.original.bus.company.name}</div>,
    },
    {
      accessorKey: "route.startCity.name",
      header: "From",
      cell: ({ row }) => <div>{row.original.route.startCity.name}</div>,
    },
    {
      accessorKey: "route.endCity.name",
      header: "To",
      cell: ({ row }) => <div>{row.original.route.endCity.name}</div>,
    },
    {
      accessorKey: "daysOfWeek",
      header: "Days",
      cell: ({ row }) => {
        const trip = row.original;
        const isEditing = editingRow === trip.id;
        
        if (isEditing && trip.recurring) {
          const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const currentSelectedDays = editData.daysOfWeek || trip.daysOfWeek;
          
          return (
            <div className="flex flex-wrap gap-1">
              {dayNames.map((day, index) => (
                <label key={day} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={currentSelectedDays.includes(index + 1)}
                    onChange={(e) => {
                      const newDays = [...currentSelectedDays];
                      if (e.target.checked) {
                        if (!newDays.includes(index + 1)) {
                          newDays.push(index + 1);
                        }
                      } else {
                        const dayIndex = newDays.indexOf(index + 1);
                        if (dayIndex > -1) {
                          newDays.splice(dayIndex, 1);
                        }
                      }
                      setEditData({ ...editData, daysOfWeek: newDays });
                    }}
                  />
                  <span className="text-xs">{day}</span>
                </label>
              ))}
            </div>
          );
        }
        
        if (!trip.recurring) return <div>-</div>;
        
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const activeDays = trip.daysOfWeek.map(dayNum => dayNames[dayNum - 1]).join(", ");
        return <div>{activeDays}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const trip = row.original;
        const isEditing = editingRow === trip.id;
        
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="default" 
                onClick={() => handleSaveEdit(trip.id)}
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
                onClick={() => handleEdit(trip.id)}
                className="flex items-center cursor-pointer"
              >
                <Pencil2Icon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(trip.id)}
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

  const fetchData = async () => {
    try {
      const response = await fetch('/api/GET/getTripData');

      if (!response.ok) {
        throw new Error('Failed to fetch trip data');
      }

      const tripData = await response.json();
      setData(Array.isArray(tripData) ? tripData : []);
    } catch (error) {
      console.error('Error fetching trip data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSuccess = () => {
    fetchData();
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      // Create the updated trip data by merging the original data with edited data
      const originalTrip = data.find(trip => trip.id === id);
      if (!originalTrip) return;
      
      const updatedTrip = { ...originalTrip, ...editData };
      
      // Make the API call to update
      const response = await fetch(`/api/PUT/updateTrip?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTrip),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip');
      }

      // Reset editing state
      setEditingRow(null);
      setEditData({});
      
      // Refresh data
      fetchData();
      
      toast({
        title: "Success",
        description: "Trip updated successfully",
      });
    } catch (error) {
      console.error('Error updating trip:', error);
      toast({
        title: "Error",
        description: "Failed to update trip",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setTripToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;
    
    try {
      const response = await fetch(`/api/DELETE/deleteTrip?id=${tripToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      // Refresh data
      fetchData();
      
      toast({
        title: "Success",
        description: "Trip deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTripToDelete(null);
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
      <TripSheet onAddSuccess={handleAddSuccess} />
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by Bus Type..."
            value={(table.getColumn("bus.busDescription")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("bus.busDescription")?.setFilterValue(event.target.value)}
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
            <TableCaption>All available trips</TableCaption>
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
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
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

export default Trip;