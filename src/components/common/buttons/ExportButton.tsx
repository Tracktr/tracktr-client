import { BsFiletypeCsv } from "react-icons/bs";
import { Tooltip } from "react-tooltip";

const ExportButton = () => {
  return (
    <button
      data-tooltip-id="export"
      data-tooltip-content="Export history"
      className="flex items-center justify-between rounded-md text-primary md:ml-auto"
      aria-label="Export history"
    >
      <span className="px-3 py-2">
        <BsFiletypeCsv className="text-xl" />
      </span>
      <Tooltip id="export" />
    </button>
  );
};

export default ExportButton;
