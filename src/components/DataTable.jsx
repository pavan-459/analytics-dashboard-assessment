import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useStore from "../state/store";
import { downloadCsv } from "../lib/downloadCsv"; 
import { rankItem } from "@tanstack/match-sorter-utils";

function fuzzyFilter(row, columnId, value, addMeta) {
  const itemRank = rankItem(String(row.getValue(columnId) ?? ""), value);
  addMeta({ itemRank });
  return itemRank.passed;
}


export default function DataTable() {
  // Use your store filters (make/type/year/search) to prefilter
  const filteredRows = useStore((s) => s.filteredRows());

  // Local (component) pagination/sorting state; TanStack will manage it
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  const [sorting, setSorting] = useState([]);

  const data = useMemo(() => filteredRows, [filteredRows]);
  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor((r) => r.Make, { id: "Make", header: "Make" }),
      columnHelper.accessor((r) => r.Model, { id: "Model", header: "Model" }),
      columnHelper.accessor((r) => r.ModelYear, {
        id: "Model Year",
        header: "Model Year",
      }),
      columnHelper.accessor((r) => r.EVType, {
        id: "EV Type",
        header: "EV Type",
      }),
      columnHelper.accessor((r) => r.County, {
        id: "County",
        header: "County",
      }),
      columnHelper.accessor((r) => r["Postal Code"], {
        id: "Postal Code",
        header: "Postal Code",
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // ← client-side pagination
    manualPagination: false, 
    globalFilterFn: fuzzyFilter,
  });

  const page = table.getRowModel();

  return (
    <div className="w-full overflow-auto">
      {/* Toolbar: Export filtered rows */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-500">
          Showing {page.rows.length.toLocaleString()} of{" "}
          {data.length.toLocaleString()} filtered rows
        </div>
        <button
          onClick={() => downloadCsv(data)}
          className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Download CSV
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-3 py-2 border-b text-left font-medium select-none cursor-pointer"
                  onClick={h.column.getToggleSortingHandler?.()}
                  title={h.column.getCanSort() ? "Click to sort" : undefined}
                >
                  <div className="inline-flex items-center gap-1">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === "asc"
                      ? "▲"
                      : h.column.getIsSorted() === "desc"
                      ? "▼"
                      : ""}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {page.rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {page.rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-6 text-center text-gray-500"
              >
                No results match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
        <div>
          Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="space-x-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>

          <select
            className="ml-2 border rounded px-2 py-1"
            value={pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100, 200].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
