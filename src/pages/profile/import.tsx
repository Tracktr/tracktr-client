import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Papa from "papaparse";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const session = useSession();
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    if (currentPercentage >= 100) router.push("/profile/history");
  }, [currentPercentage, router]);

  const importRoute = trpc.profile.import.useMutation();

  const changeHandler = (event: any) => {
    setLoading(true);

    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: async function ({ data }: { data: ITraktData[] }) {
        const formattedData = data.map((item) => {
          if (!item.tmdb_id) {
            console.error("NO ID", item);
            return {
              id: "",
              type: "",
              datetime: "",
            };
          }
          if (!item.type) {
            console.error("No type", item);
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

        const maxAmount = 250;
        const amount = Math.ceil(formattedData.length / maxAmount);

        for (let i = 1; i <= amount; i++) {
          await importRoute.mutateAsync(formattedData.slice(maxAmount * (i - 1), maxAmount * i)).then(() => {
            setCurrentPercentage(Math.ceil((i / amount) * 100));
          });
        }
      },
    });
  };

  return (
    <div className="max-w-6xl pt-24 m-auto">
      <div className="my-5">
        <h1 className="mb-2 text-3xl">Import history from Trakt.tv</h1>
        <div>Export your history from Trakt.tv by going to the history page and pressing the CSV button.</div>
      </div>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-64 bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg ${
            !loading && "cursor-pointer hover:bg-bray-800 hover:border-gray-500 hover:bg-gray-600"
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center w-full">
              <div className="mb-3">Importing data...</div>
              <div className="flex w-[15%] bg-black rounded-full">
                <span
                  className="h-2 transition-all duration-300 ease-in-out rounded-full bg-primary"
                  style={{ width: `${currentPercentage}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">CSV only</p>
            </div>
          )}
          <input
            id="dropzone-file"
            type="file"
            accept=".csv"
            disabled={loading}
            onChange={changeHandler}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ImportPage;
