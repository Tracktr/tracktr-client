interface GenresBlockProps {
  genres?: string[];
  themeColor?: any;
}

const GenresBlock = ({ genres, themeColor }: GenresBlockProps) => {
  return (
    <div className="flex">
      {genres?.map((genre: any) => (
        <span
          key={genre.id}
          style={{
            background: themeColor.hex,
          }}
          className={`
              inline-block px-2 py-1 mt-3 mr-2 text-sm font-semibold rounded-md          
              ${themeColor.isDark && "text-white"}
              ${themeColor.isLight && "text-primaryBackground"}
            `}
        >
          {genre.name}
        </span>
      ))}
    </div>
  );
};

export default GenresBlock;
