import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import React from "react";

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];
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
  maxHeight,
  onRowClick,
  rowExpandable,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className="rounded-2xl bg-white"
      style={{ maxHeight }}
    > <div className="w-full overflow-x-auto ">
      <table className="min-w-full text-sm table-auto">
        {/* ───── Head ───── */}
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-5 py-3 text-left font-semibold"
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
          {table.getRowModel().rows.map((row, i) => {
            const originalRow = row.original;
            const isExpanded =
              typeof rowExpandable?.isRowExpanded === "function"
                ? rowExpandable.isRowExpanded(originalRow)
                : false;

            return (
              <React.Fragment key={row.id}>
                {/* Main Table Row */}
                <tr
                  className={`
                    border-t border-gray-100
                    ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}
                    hover:bg-indigo-50/40 cursor-pointer transition
                  `}
                  onClick={() => {
                    rowExpandable?.onExpand?.(originalRow);
                    onRowClick?.(originalRow);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3 align-top whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>

                {/* Expanded Area: logs, trace, etc. */}
                {isExpanded && rowExpandable?.expandedRowRender && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-3 bg-indigo-50/30">
                      {rowExpandable.expandedRowRender(originalRow)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
}
