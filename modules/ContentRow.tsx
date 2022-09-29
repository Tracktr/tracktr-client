import Poster, { IPoster } from '../components/Poster';
import SortPill from '../components/SortPill';

interface IContentRow {
  type: string;
  data: IPoster[];
}

const ContentRow = ({ type, data }: IContentRow) => {
  return (
    <div>
      <div className="flex">
        <div className="text-4xl mb-6">{type}</div>
        <SortPill />
      </div>
      <div className="flex gap-6 justify-center">
        {data.map((p) => {
          return <Poster imageSrc={p.imageSrc} name={p.name} />;
        })}
      </div>
    </div>
  );
};

export default ContentRow;
