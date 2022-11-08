interface GenresBlockProps {
  genres?: string[];
}

const GenresBlock = ({ genres }: GenresBlockProps) => {
  return (
    genres && (
      <div className="flex pt-2">
        {genres?.map((genre: any) => (
          <span
            key={genre.id}
            className="inline-block px-2 py-1 mt-2 mr-2 text-sm font-semibold rounded-md text-primaryBackground bg-primary"
          >
            {genre.name}
          </span>
        ))}
      </div>
    )
  );
};

export default GenresBlock;
