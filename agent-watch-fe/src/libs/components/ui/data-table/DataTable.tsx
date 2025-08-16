import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import React from "react";
import { Skeleton } from "../skeleton/Skeleton";

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  maxHeight?: string;
  onRowClick?: (row: TData) => void;
  rowExpandable?: {
    expandedRowRender: (row: TData) => React.ReactNode;
    isRowExpanded?: (row: TData) => boolean;
    onExpand?: (row: TData) => void;
  };
};

export function DataTable<TData extends object>({
  columns,
  data,
  loading = false,
  maxHeight = "400px",
  onRowClick,
  rowExpandable,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-2xl bg-white w-full overflow-x-auto">
      <div style={{ maxHeight, overflowY: "auto" }}>
        <table className="min-w-full text-sm table-auto border-collapse">
          {/* ───── Head ───── */}
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-left font-semibold bg-gray-50"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ───── Body ───── */}
          <tbody className="text-gray-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-t border-gray-100">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-5 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, i) => {
                const originalRow = row.original;
                const isExpanded =
                  typeof rowExpandable?.isRowExpanded === "function"
                    ? rowExpandable.isRowExpanded(originalRow)
                    : false;

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`border-t border-gray-100 
                        ${i % 2 === 1 ? "bg-gray-50" : "bg-white"} 
                        hover:bg-indigo-50/40 cursor-pointer transition
                      `}
                      onClick={() => {
                        rowExpandable?.onExpand?.(originalRow);
                        onRowClick?.(originalRow);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-5 py-3 align-top whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>

                    {isExpanded && rowExpandable?.expandedRowRender && (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="px-6 py-3 bg-indigo-50/30"
                        >
                          {rowExpandable.expandedRowRender(originalRow)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-6 text-center text-gray-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
