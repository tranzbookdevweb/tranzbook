"use client";

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
import BusSheet from '@/app/admin12/components/Sheetpop/MasterDataPop/VehicleMakeSheet';

interface Company {
  id: string;
  name: string;
  email: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  busDescription: string;
  onArrival: boolean;
  status: string;
  image: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  airConditioning: boolean;
  chargingOutlets: boolean;
  wifi: boolean;
  restRoom: boolean;
  seatBelts: boolean;
  onboardFood: boolean;
  company: Company;
}

interface BusResponse {
  buses: Bus[];
}

export function VehicleMakeDataTable() {
  const [data, setData] = useState<Bus[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Bus>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState<string | null>(null);

  const columns: ColumnDef<Bus>[] = [
    {
      accessorKey: "Sno",
      header: "Sr No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "plateNumber",
      header: "Plate Number",
      cell: ({ row }) => {
        const bus = row.original;
        const isEditing = editingRow === bus.id;
        
        if (isEditing) {
          return (
            <Input
              value={editData.plateNumber !== undefined ? editData.plateNumber : bus.plateNumber || ""}
              onChange={(e) => setEditData({ ...editData, plateNumber: e.target.value })}
              className="w-full"
            />
          );
        }
        return <div>{bus.plateNumber || "N/A"}</div>;
      },
    },
    {
      accessorKey: "busDescription",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bus Type
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const bus = row.original;
        const isEditing = editingRow === bus.id;
        
        if (isEditing) {
          return (
            <Input
              value={editData.busDescription !== undefined ? editData.busDescription : bus.busDescription}
              onChange={(e) => setEditData({ ...editData, busDescription: e.target.value })}
              className="w-full"
            />
          );
        }
        return <div>{bus.busDescription}</div>;
      },
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => {
        const bus = row.original;
        const isEditing = editingRow === bus.id;
        
        if (isEditing) {
          return (
            <Input
              type="number"
              value={editData.capacity !== undefined ? editData.capacity : bus.capacity}
              onChange={(e) => setEditData({ ...editData, capacity: parseInt(e.target.value) })}
              className="w-full"
            />
          );
        }
        return <div>{bus.capacity}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const bus = row.original;
        const isEditing = editingRow === bus.id;
        
        if (isEditing) {
          return (
            <select
              value={editData.status !== undefined ? editData.status : bus.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              className="p-2 border rounded w-full"
            >
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          );
        }
        return <div className={`capitalize ${bus.status === "available" ? "text-green-600" : "text-red-600"}`}>{bus.status}</div>;
      },
    },
    {
      accessorKey: "company.name",
      header: "Company",
      cell: ({ row }) => <div>{row.original.company?.name || "N/A"}</div>,
    },
    // {
    //   accessorKey: "image",
    //   header: "Image",
    //   cell: ({ row }) => (
    //     <img 
    //       className='h-24 w-24 object-cover rounded-md' 
    //       src={`https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/images/${row.original.image || 'default-bus.png'}`} 
    //       alt='Bus Image'
    //     />
    //   ),
    // },
    {
      accessorKey: "features",
      header: "Features",
      cell: ({ row }) => {
        const bus = row.original;
        const isEditing = editingRow === bus.id;
        
        if (isEditing) {
          return (
            <div className="flex flex-col gap-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.airConditioning !== undefined ? editData.airConditioning : bus.airConditioning}
                  onChange={(e) => setEditData({ ...editData, airConditioning: e.target.checked })}
                />
                <span>AC</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.wifi !== undefined ? editData.wifi : bus.wifi}
                  onChange={(e) => setEditData({ ...editData, wifi: e.target.checked })}
                />
                <span>WiFi</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.chargingOutlets !== undefined ? editData.chargingOutlets : bus.chargingOutlets}
                  onChange={(e) => setEditData({ ...editData, chargingOutlets: e.target.checked })}
                />
                <span>Charging</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.restRoom !== undefined ? editData.restRoom : bus.restRoom}
                  onChange={(e) => setEditData({ ...editData, restRoom: e.target.checked })}
                />
                <span>RestRoom</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.seatBelts !== undefined ? editData.seatBelts : bus.seatBelts}
                  onChange={(e) => setEditData({ ...editData, seatBelts: e.target.checked })}
                />
                <span>Seatbelts</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.onboardFood !== undefined ? editData.onboardFood : bus.onboardFood}
                  onChange={(e) => setEditData({ ...editData, onboardFood: e.target.checked })}
                />
                <span>Food</span>
              </label>
            </div>
          );
        }
        
        const features = [];
        if (bus.airConditioning) features.push("AC");
        if (bus.wifi) features.push("WiFi");
        if (bus.chargingOutlets) features.push("Charging");
        if (bus.restRoom) features.push("RestRoom");
        if (bus.seatBelts) features.push("Seatbelts");
        if (bus.onboardFood) features.push("Food");
        
        return (
          <div className="flex flex-wrap gap-1">
            {features.map(feature => (
              <span key={feature} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const bus = row.original;
        const isEditing = editingRow === bus.id;
        
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="default" 
                onClick={() => handleSaveEdit(bus.id)}
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
                onClick={() => handleEdit(bus.id)}
                className="flex items-center cursor-pointer"
              >
                <Pencil2Icon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(bus.id)}
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

  const getBuses = async () => {
    try {
      const response = await fetch('/api/GET/getBusData');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData: BusResponse = await response.json();
      setData(responseData.buses || []);
    } catch (error) {
      console.error('Error fetching bus data:', error);
    }
  };

  useEffect(() => {
    getBuses();
  }, []);

  const handleAddSuccess = () => {
    getBuses();
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      // Create the updated bus data by merging the original data with edited data
      const originalBus = data.find(bus => bus.id === id);
      if (!originalBus) return;
      
      const updatedBus = { ...originalBus, ...editData };
      
      // Make the API call to update
      const response = await fetch(`/api/PUT/updateBus?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBus),
      });

      if (!response.ok) {
        throw new Error('Failed to update bus');
      }

      // Reset editing state
      setEditingRow(null);
      setEditData({});
      
      // Refresh data
      getBuses();
      
      toast({
        title: "Success",
        description: "Bus updated successfully",
      });
    } catch (error) {
      console.error('Error updating bus:', error);
      toast({
        title: "Error",
        description: "Failed to update bus",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setBusToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!busToDelete) return;
    
    try {
      const response = await fetch(`/api/DELETE/deleteBus?id=${busToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bus');
      }

      // Refresh data
      getBuses();
      
      toast({
        title: "Success",
        description: "Bus deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast({
        title: "Error",
        description: "Failed to delete bus",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBusToDelete(null);
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
      <BusSheet onAddSuccess={handleAddSuccess} />
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Plate Number..."
            value={(table.getColumn("plateNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("plateNumber")?.setFilterValue(event.target.value)
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
            <TableCaption>A list of available buses.</TableCaption>
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
                    No results.
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
            <DialogTitle>Delete Bus</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bus? This action cannot be undone.
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

export default VehicleMakeDataTable;