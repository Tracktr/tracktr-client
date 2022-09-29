import Poster from '../components/Poster';
import SortPill from '../components/SortPill';

const ContentRow = () => {
  return (
    <div>
      <div className="flex">
        <div className="text-4xl mb-6">Trending</div>
        <SortPill />
      </div>
      <div className="flex gap-6 justify-center">
        <Poster />
        <Poster />
        <Poster />
        <Poster />
        <Poster />
        <Poster />
      </div>
    </div>
  );
};

export default ContentRow;
