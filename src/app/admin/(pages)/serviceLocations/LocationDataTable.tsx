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
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    cell: ({ row }) => <div>{row.getValue("duration")} minutes</div>,
  },
  {
    accessorKey: "distance",
    header: "Distance",
    cell: ({ row }) => <div>{row.getValue("distance")} km</div>,
  },
  {
    accessorKey: "branch.name",
    header: "Company",
    cell: ({ row }) => <div>{row.original.branch.name}</div>,
  },
];
export function Location() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<RouteData[]>([]);


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

  const table = useReactTable({
    data: data,
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
            placeholder="Filter by ID..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
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
            <TableCaption>A list of your promo codes.</TableCaption>
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
    </div>
  );
}

export default Location;
