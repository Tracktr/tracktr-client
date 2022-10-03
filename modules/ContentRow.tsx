import Poster, { IPoster } from "../components/Poster";
import SortPill, { ISortPillButton } from "../components/SortPill";

interface IContentRow {
  type: string;
  data: IPoster[];
  buttons: ISortPillButton[];
}

const ContentRow = ({ type, data, buttons }: IContentRow) => (
  <div className="mt-1 mb-10 z">
    <div className="flex">
      <div className="z-40 text-4xl mb-6">{type}</div>
      <SortPill buttons={buttons} />
    </div>
    <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center">
      {data.map((p) => (
        <Poster key={p.name} imageSrc={p.imageSrc} name={p.name} />
      ))}
    </div>
  </div>
);

export default ContentRow;
