import { saveAs } from "file-saver";
import Papa from "papaparse";

export function downloadCsv(rows, filename = "filtered_data.csv") {
  if (!rows || rows.length === 0) {
    alert("No data to download");
    return;
  }
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
