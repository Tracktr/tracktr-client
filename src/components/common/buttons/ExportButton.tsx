import { useEffect, useState } from "react";
import { BsFiletypeCsv } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { Tooltip } from "react-tooltip";
import { trpc } from "../../../utils/trpc";

const ExportButton = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const { data, isFetching } = trpc.profile.export.useQuery(undefined, {
    enabled: isEnabled,
  });

  useEffect(() => {
    if (data) {
      download("tracktr-export.csv", data);
    }
  }, [data]);

  return (
    <button
      data-tooltip-id="export"
      data-tooltip-content="Export history"
      className="flex items-center justify-between rounded-md text-primary md:ml-auto"
      aria-label="Export history"
      onClick={() => setIsEnabled(true)}
      disabled={isFetching}
    >
      {isFetching ? (
        <span className="px-3 py-2">
          <ImSpinner2 className="text-xl animate-spin" />
        </span>
      ) : (
        <>
          <span className="px-3 py-2">
            <BsFiletypeCsv className="text-xl" />
          </span>
          <Tooltip id="export" />
        </>
      )}
    </button>
  );
};

const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export default ExportButton;
