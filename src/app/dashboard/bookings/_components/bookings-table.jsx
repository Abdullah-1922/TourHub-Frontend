"use client";

// Packages
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";

// Components
import { ErrorState } from "@/app/packages/[id]/_components/package-details-container";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";
import { BookingsColumn } from "./bookings-column";

const BookingsTable = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/booking`).then(
        (res) => res.json()
      ),
  });

  let content;

  // Show loading spinner while data is being fetched
  if (isLoading) {
    content = (
      <div className="h-[80vh] md:h-[calc(100vh-25vh)]  w-full flex justify-center gap-x-2 items-center">
        <Loader2 className="animate-spin text-tourHub-green-dark h-5 w-5" />
      </div>
    );
  }
  // Handle error state and display message with animation effect
  else if (isError) {
    content = <ErrorState message={error.message} />;
  } else if (response) {
    // Memoizing the processed transactions
    const processedBookings = response?.data?.result.map(
      ({ createdAt, transactionId, paymentStatus, packageId, amount }) => ({
        createdAt,
        transactionId,
        paymentStatus,
        packageId: packageId?._id,
        name: packageId?.name,
        amount,
      })
    );

    content = (
      <TableContainer data={processedBookings} columns={BookingsColumn} />
    );
  }

  return <div>{content}</div>;
};

export default BookingsTable;

const TableContainer = ({ data, columns }) => {
  const [columnFilters, setColumnFilters] = useState([]); // State for column filters
  const [sorting, setSorting] = useState([]); // State for sorting

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });
  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Search by transaction ID"
          value={table.getColumn("transactionId")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("transactionId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm focus-visible:ring-[#3a6f54]"
        />

        <DataTableViewOptions table={table} />
      </div>
      <DataTable columns={columns} table={table} />
      {data?.length > 10 && (
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
};