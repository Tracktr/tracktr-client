import { useQuery } from "react-query";
import Poster, { IPoster } from "../components/Poster";
import SortPill, { ISortPillButtons } from "../components/SortPill";

interface IContentRow {
  type: string;
  buttons?: ISortPillButtons;
  fetchContent: () => IPoster[];
}

const ContentRow = ({ type, buttons, fetchContent }: IContentRow) => {
  const { isSuccess, data, isLoading, isError } = useQuery(
    [`get${type}Content`, buttons?.currentValue || ""],
    () => fetchContent(),
    {
      staleTime: 24 * (60 * (60 * 1000)), // 24 hours
    }
  );

  return (
    <div className="mt-1 mb-10">
      <div className="flex flex-wrap items-center gap-4 py-5">
        <div className="z-40 text-4xl">{type}</div>
        {buttons && <SortPill buttons={buttons} />}
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-10">
        {isLoading && <div className="z-40">Loading</div>}
        {isError && <div className="z-40">Something went wrong...</div>}
        {isSuccess && data.map((p: IPoster) => <Poster key={p.name} imageSrc={p.imageSrc} name={p.name} />)}
      </div>
    </div>
  );
};

export default ContentRow;
