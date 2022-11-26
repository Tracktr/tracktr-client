import Papa from "papaparse";
import { trpc } from "../../utils/trpc";

export interface ITraktData {
  action: string;
  episode_imdb_id: string;
  episode_number: string;
  episode_released: string;
  episode_title: string;
  episode_tmdb_id: string;
  episode_trakt_id: string;
  episode_trakt_rating: string;
  episode_tvdb_id: string;
  genres: string;
  imdb_id: string;
  released: string;
  runtime: string;
  season_number: string;
  title: string;
  tmdb_id: string;
  trakt_id: string;
  trakt_rating: string;
  tvdb_id: string;
  type: string;
  url: string;
  watched_at: string;
  year: string;
}

const ImportPage = () => {
  const importRoute = trpc.profile.import.useMutation({});

  const changeHandler = (event: any) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function ({ data }: { data: ITraktData[] }) {
        console.log(data);
        const formattedData = data.map((item) => {
          if (!item.tmdb_id) {
            console.log("NO ID", item);
            return {
              id: "",
              type: "",
              datetime: "",
            };
          }
          if (!item.type) {
            console.log("No type", item);
            return {
              id: "",
              type: "",
              datetime: "",
            };
          }

          return {
            id: item.tmdb_id,
            type: item.type,
            season: item.season_number,
            episode: item.episode_number,
            datetime: item.watched_at,
          };
        });

        importRoute.mutate(formattedData);
      },
    });
  };

  return (
    <div className="max-w-6xl pt-24 m-auto">
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
        style={{ display: "block", margin: "10px auto" }}
      />
    </div>
  );
};

export default ImportPage;
