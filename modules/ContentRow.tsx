import Poster, { IPoster } from "../components/Poster";
import SortPill, { ISortPillButton } from "../components/SortPill";

interface IContentRow {
  type: string;
  data: IPoster[];
  buttons: ISortPillButton[];
}

const ContentRow = ({ type, data, buttons }: IContentRow) => (
  <div className="my-5">
    <div className="flex">
      <div className="text-4xl mb-6">{type}</div>
      <SortPill buttons={buttons} />
    </div>
    <div className="flex flex-wrap gap-6 justify-center">
      {data.map((p) => (
        <Poster key={p.name} imageSrc={p.imageSrc} name={p.name} />
      ))}
    </div>
  </div>
);

export default ContentRow;
