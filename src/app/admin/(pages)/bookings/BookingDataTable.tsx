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
      company: {
        id: string;
        name: string;
        logo: string | null;
        email: string;
      };
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
      cell: ({ row }) => (
        <div className="font-semibold text-slate-700 text-center w-12">
          {row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "user.name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 min-w-[200px]">
          <div className="flex-shrink-0">
            {row.original.user.profileImage ? (
              <img
                src={row.original.user.profileImage}
                alt={row.original.user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {row.original.user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900">{row.original.user.name}</div>
            <div className="text-sm text-slate-500">{row.original.user.email}</div>
            {row.original.user.phoneNumber && (
              <div className="text-xs text-slate-400 font-mono">{row.original.user.phoneNumber}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "reference",
      header: "Booking Reference",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          {row.getValue("reference")}
        </div>
      ),
    },
    {
      accessorKey: "trip.route",
      header: "Route",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <div className="flex items-center space-x-2 font-semibold text-slate-900 mb-1">
            <span>{row.original.trip.route.from.city}</span>
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <span>{row.original.trip.route.to.city}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {row.original.trip.route.duration} min
            </span>
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {row.original.trip.route.distance} km
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "bookingDate",
      header: "Travel Details",
      cell: ({ row }) => (
        <div className="min-w-[140px]">
          <div className="font-semibold text-slate-900 mb-1">
            {new Date(row.getValue("bookingDate")).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-sm text-slate-600">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {row.original.trip.departureTime}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "seatNumbers",
      header: "Seats",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 min-w-[80px]">
          {row.original.seatNumbers.map((seat, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200"
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
        <div className="min-w-[200px] max-w-[250px]">
          <div className="space-y-1">
            {row.original.passengers.slice(0, 2).map((passenger, index) => (
              <div key={passenger.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">{passenger.name}</span>
                <span className="text-slate-500 text-xs bg-slate-100 px-2 py-0.5 rounded">
                  {passenger.age}y
                </span>
              </div>
            ))}
            {row.original.passengers.length > 2 && (
              <div className="text-xs text-slate-500 font-medium">
                +{row.original.passengers.length - 2} more
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "trip.bus",
      header: "Bus & Company",
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          {row.original.trip.bus ? (
            <div className="space-y-2">
              {/* Company Info */}
              <div className="flex items-center space-x-2 mb-2">
                {row.original.trip.bus.company.logo ? (
                  <img
                    src={`https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${row.original.trip.bus.company.logo}`}
                    alt={row.original.trip.bus.company.name}
                    className="w-8 h-8 rounded object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">
                    {row.original.trip.bus.company.name.substring(0, 2)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {row.original.trip.bus.company.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.original.trip.bus.description || "Plate N/A"}
                  </div>
                </div>
              </div>
              
              {/* Bus Details */}
              <div className="text-xs text-slate-600">
                <div className="flex items-center mb-1">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Capacity: {row.original.trip.bus.capacity}
                </div>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {row.original.trip.bus.amenities.wifi && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">WiFi</span>
                  )}
                  {row.original.trip.bus.amenities.airConditioning && (
                    <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">AC</span>
                  )}
                  {row.original.trip.bus.amenities.chargingOutlets && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Charging</span>
                  )}
                  {row.original.trip.bus.amenities.onboardFood && (
                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">Food</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm italic flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Bus not assigned
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-right min-w-[100px]">
          <div className="font-bold text-lg text-slate-900">
            {row.getValue("totalAmount")}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {row.original.trip.currency}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusConfig = {
          confirmed: {
            bg: 'bg-emerald-100 border-emerald-200',
            text: 'text-emerald-800',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )
          },
          cancelled: {
            bg: 'bg-red-100 border-red-200',
            text: 'text-red-800',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )
          },
          pending: {
            bg: 'bg-amber-100 border-amber-200',
            text: 'text-amber-800',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          refunded: {
            bg: 'bg-blue-100 border-blue-200',
            text: 'text-blue-800',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            )
          }
        };
        
        const config = statusConfig[status as keyof typeof statusConfig] || {
          bg: 'bg-slate-100 border-slate-200',
          text: 'text-slate-800',
          icon: null
        };

        return (
          <div className="min-w-[100px]">
            <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.bg} ${config.text}`}>
              {config.icon}
              <span>{status.toUpperCase()}</span>
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
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-slate-700">Loading bookings...</div>
          <div className="text-sm text-slate-500 mt-1">Please wait while we fetch your data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-2">Booking Management</h2>
        <p className="text-blue-100">Comprehensive overview of all customer bookings and trip details</p>
      </div>

      {/* Filters Section */}
      <div className="flex items-center py-6 gap-4 px-6 bg-slate-50 rounded-lg mb-6">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-slate-700">Search by Reference</label>
          <Input
            placeholder="Enter booking reference..."
            value={(table.getColumn("reference")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("reference")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-slate-700">Search by Customer</label>
          <Input
            placeholder="Enter customer name..."
            value={(table.getColumn("user.name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("user.name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 block mb-2">Column Visibility</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-100">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
      </div>
      
      {/* Table Section */}
      <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-white">
        <Table>
          <TableCaption className="py-4 text-slate-600 bg-slate-50">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>
                Complete booking records with passenger and trip information
                {data.length > 0 && ` • Total: ${data.length} booking${data.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-100 hover:bg-slate-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-bold text-slate-800 py-4 px-6">
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
                  className="hover:bg-slate-50 border-b border-slate-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-6 px-6">
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
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 space-y-3">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-lg font-semibold text-slate-600">No bookings found</p>
                      <p className="text-sm text-slate-400">There are no booking records to display at this time.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Section */}
      <div className="flex items-center justify-between space-x-2 py-6 px-6 bg-slate-50 rounded-lg mt-6">
        <div className="flex-1 text-sm text-slate-600">
          <span className="font-medium">
            {table.getFilteredSelectedRowModel().rows.length}
          </span> of{" "}
          <span className="font-medium">
            {table.getFilteredRowModel().rows.length}
          </span> row(s) selected
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm font-medium text-slate-700">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-slate-300 hover:bg-slate-100"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-slate-300 hover:bg-slate-100"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDataTable;