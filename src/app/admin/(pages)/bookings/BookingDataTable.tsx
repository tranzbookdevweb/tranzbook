"use client";

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
  ChevronDownIcon,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Updated interface to match the new API response
interface BookingData {
  bookingId: string;
  reference: string;
  bookingDate: string;
  status: string;
  totalAmount: number;
  seatNumbers: number[];
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    profileImage: string | null;
  };
  trip: {
    id: string;
    departureTime: string;
    price: number;
    currency: string;
    route: {
      from: {
        city: string;
        country: string;
      };
      to: {
        city: string;
        country: string;
      };
      duration: number;
      distance: number;
    };
    bus: {
      plateNumber: string | null;
      capacity: number;
      description: string | null;
      amenities: {
        airConditioning: boolean;
        chargingOutlets: boolean;
        wifi: boolean;
        restRoom: boolean;
        seatBelts: boolean;
        onboardFood: boolean;
      };
    } | null;
    driver: {
      name: string;
      mobile: string;
    } | null;
  };
  passengers: {
    id: string;
    name: string;
    age: string;
    phoneNumber: string;
    kinName: string;
    kinContact: string;
  }[];
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: BookingData[];
}

export function BookingDataTable() {
  const [data, setData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const getBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/GET/getUserBookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const result: ApiResponse = await response.json();
      setData(result.success ? result.data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const columns: ColumnDef<BookingData>[] = [
    {
      accessorKey: "Sno",
      header: "Sr No",
      cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
      accessorKey: "user.name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.user.name}</span>
          <span className="text-sm text-gray-500">{row.original.user.email}</span>
          {row.original.user.phoneNumber && (
            <span className="text-xs text-gray-400">{row.original.user.phoneNumber}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("reference")}</div>
      ),
    },
    {
      accessorKey: "trip.route",
      header: "Route",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.trip.route.from.city} → {row.original.trip.route.to.city}
          </span>
          <span className="text-xs text-gray-500">
            {row.original.trip.route.duration} min • {row.original.trip.route.distance} km
          </span>
        </div>
      ),
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{new Date(row.getValue("bookingDate")).toLocaleDateString()}</span>
          <span className="text-xs text-gray-500">
            Departure: {row.original.trip.departureTime}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "seatNumbers",
      header: "Seats",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.seatNumbers.map((seat, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
            >
              {seat}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "passengers",
      header: "Passengers",
      cell: ({ row }) => (
        <div className="flex flex-col max-w-48">
          {row.original.passengers.map((passenger, index) => (
            <div key={passenger.id} className="text-sm">
              <span className="font-medium">{passenger.name}</span>
              <span className="text-gray-500 ml-1">({passenger.age})</span>
              {index < row.original.passengers.length - 1 && ", "}
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "trip.bus",
      header: "Bus Info",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          {row.original.trip.bus ? (
            <>
              <span className="font-medium">
                {row.original.trip.bus.plateNumber || "N/A"}
              </span>
              <span className="text-xs text-gray-500">
                Capacity: {row.original.trip.bus.capacity}
              </span>
              <div className="flex gap-1 mt-1">
                {row.original.trip.bus.amenities.wifi && (
                  <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">WiFi</span>
                )}
                {row.original.trip.bus.amenities.airConditioning && (
                  <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">AC</span>
                )}
              </div>
            </>
          ) : (
            <span className="text-gray-400">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("totalAmount")} {row.original.trip.currency}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div>
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : status === 'refunded'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>
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

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by reference..."
          value={(table.getColumn("reference")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("reference")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by user name..."
          value={(table.getColumn("user.name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("user.name")?.setFilterValue(event.target.value)
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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            All user bookings with trip details and passenger information.
            {data.length > 0 && ` Showing ${data.length} booking${data.length !== 1 ? 's' : ''}.`}
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
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
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
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
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium">No bookings found</p>
                    <p className="text-sm">There are no bookings to display at this time.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
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

export default BookingDataTable;