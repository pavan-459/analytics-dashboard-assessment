import { useMemo } from "react";
import {
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import useStore from "../state/store";

export default function DataTable() {
  const filteredRows = useStore(s => s.filteredRows());

  const data = useMemo(() => filteredRows, [filteredRows]);
  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor(r => r.Make, { id: "Make", header: "Make", cell: info => info.getValue() }),
    columnHelper.accessor(r => r["Model"], { id: "Model", header: "Model", cell: info => info.getValue() }),
    columnHelper.accessor(r => r.ModelYear, { id: "Model Year", header: "Model Year", cell: info => info.getValue() }),
    columnHelper.accessor(r => r.EVType, { id: "EV Type", header: "EV Type", cell: info => info.getValue() }),
    columnHelper.accessor(r => r["County"], { id: "County", header: "County", cell: info => info.getValue() }),
    columnHelper.accessor(r => r["Postal Code"], { id: "Postal Code", header: "Postal Code", cell: info => info.getValue() }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="text-left font-medium text-gray-600 px-3 py-2 border-b">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
        <div>
          Page {table.getState().pagination?.pageIndex + 1 || 1} of {table.getPageCount() || 1}
        </div>
        <div className="space-x-2">
          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{'<<'}</button>
          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>{'>>'}</button>
        </div>
      </div>
    </div>
  );
}

