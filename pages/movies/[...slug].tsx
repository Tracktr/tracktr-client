import ContentHeader from "../../components/content/ContentHeader";

const MoviePage = () => (
  <div>
    <ContentHeader
      cover="https://www.themoviedb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg"
      poster="https://www.themoviedb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
      title="Interstellar"
      date="2021"
      imdbScore="8.0"
      audienceScore="79"
    />
    <div className="relative z-10 max-w-6xl m-auto mt-6 pl-60">
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <p>
            The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the
            limitations on human space travel and conquer the vast distances involved in an interstellar voyage.
          </p>
        </div>

        {/* TODO: col-span-1 buttons */}
      </div>
    </div>
  </div>
);

export default MoviePage;
