import Image from 'next/image';

const Poster = () => {
  return (
    <div>
      <Image
        src="https://image.tmdb.org/t/p/original/wSqAXL1EHVJ3MOnJzMhUngc8gFs.jpg"
        width="170px"
        height="240px"
        className="rounded"
      />
      <div className="text-xs">Orphan: First Kill</div>
    </div>
  );
};

export default Poster;
