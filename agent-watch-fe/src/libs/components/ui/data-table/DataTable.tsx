

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  maxHeight?: string; // e.g. "500px"
};

export function DataTable<TData extends object>({
  columns,
  data,
  maxHeight, // optional vertical scroll cap
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={`
        overflow-x-auto
        rounded-2xl
        bg-white
      
      `}
      style={{ maxHeight }}
    >
      <table className="min-w-full text-sm">
        {/* ───── Head ───── */}
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-5 py-3 text-left font-semibold">
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
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`
                border-t border-gray-100
                ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}
                hover:bg-indigo-50/40
                transition
              `}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-5 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
