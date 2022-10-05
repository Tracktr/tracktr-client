import Poster, { IPoster } from "../components/Poster";
import SortPill, { ISortPillButtons } from "../components/SortPill";

interface IContentRow {
  type: string;
  data: IPoster[];
  buttons?: ISortPillButtons;
}

const ContentRow = ({ type, data, buttons }: IContentRow) => (
  <div className="mt-1 mb-10 z">
    <div className="flex flex-wrap items-center gap-4 py-5">
      <div className="z-40 text-4xl">{type}</div>
      {buttons && <SortPill buttons={buttons} />}
    </div>
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-10">
      {data.map((p) => (
        <Poster key={p.name} imageSrc={p.imageSrc} name={p.name} />
      ))}
    </div>
  </div>
);

export default ContentRow;
