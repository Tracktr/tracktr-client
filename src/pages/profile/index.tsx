import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = trpc.profile.profileBySession.useQuery();
  const { data: watchRegions } = trpc.common.watchProviders.useQuery();

  const [adult, setAdult] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const mutation = trpc.profile.updateProfile.useMutation();

  const onSubmit = (event: any) => {
    event.preventDefault();

    mutation.mutate({
      adult,
      language: selectedLanguage,
      location: selectedLocation,
    });
  };

  useEffect(() => {
    if (status === "success") {
      setAdult(data.profile?.adult ?? false);

      setSelectedLanguage(data?.profile?.language ?? "en");
      setSelectedLocation(data?.profile?.location ?? "GB");
    }
  }, [data, status]);

  useEffect(() => {
    if (session.status === "unauthenticated" && status !== "loading") {
      router.push("/");
    }
  });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={data?.image} name={data?.name} />
          <div className="p-4 mx-4 mt-16 text-white rounded-md md:max-w-md bg-zinc-900">
            <form onSubmit={onSubmit}>
              <p className="pb-6 text-2xl font-bold">Settings</p>
              <label className="flex items-center w-full pb-1">
                <span>Show adult 18+ content</span>
                <input
                  type="checkbox"
                  className="ml-auto outline-none text-primary"
                  onChange={() => setAdult(!adult)}
                  checked={adult}
                />
              </label>

              <label className="flex items-center w-full pb-1">
                <span>Language</span>
                <select
                  className="ml-auto text-primaryBackground"
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  value={selectedLanguage}
                >
                  {data &&
                    Object.values(data.languages).map(({ englishName, iso_639_1 }: any) => (
                      <option key={iso_639_1} value={iso_639_1}>
                        {englishName}
                      </option>
                    ))}
                </select>
              </label>

              <label className="flex items-center w-full">
                <span>Streaming Location</span>
                <select
                  className="ml-auto text-primaryBackground"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  value={selectedLocation}
                >
                  {data &&
                    Object.values(watchRegions.results).map(({ english_name, iso_3166_1 }: any) => (
                      <option key={iso_3166_1} value={iso_3166_1}>
                        {english_name}
                      </option>
                    ))}
                </select>
              </label>

              <div className="flex items-center mt-12">
                <button
                  className="px-8 py-3 text-base font-semibold text-center rounded-md outline-none text-primaryBackground bg-primary"
                  type="submit"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default ProfilePage;
