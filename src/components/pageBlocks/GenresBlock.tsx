interface GenresBlockProps {
  genres?: string[];
}

const GenresBlock = ({ genres }: GenresBlockProps) => {
  return (
    <div className="flex">
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        genres?.map((genre: any) => (
          <span
            key={genre.id}
            className="inline-block px-2 py-1 mt-3 mr-2 text-sm font-semibold rounded-md text-primaryBackground bg-primary"
          >
            {genre.name}
          </span>
        ))
      }
    </div>
  );
};

export default GenresBlock;
