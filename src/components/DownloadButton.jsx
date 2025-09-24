import { downloadCsv } from "../lib/downloadCsv";
import useStore from "../state/store";

function DownloadButton() {
  const filteredRows = useStore((s) => s.filteredRows());

  return (
    <button
      onClick={() => downloadCsv(filteredRows)}
      className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
    >
      Download CSV
    </button>
  );
}

export default DownloadButton;
