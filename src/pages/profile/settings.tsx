import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = trpc.profile.profileBySession.useQuery();
  const { data: languages } = trpc.common.languages.useQuery();
  const { data: watchRegions } = trpc.common.watchProviderRegions.useQuery();

  const [adult, setAdult] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const { mutate, isLoading } = trpc.profile.updateProfile.useMutation();

  const onSubmit = (event: any) => {
    event.preventDefault();

    mutate({
      adult,
      language: selectedLanguage,
      region: selectedLocation,
    });
  };

  useEffect(() => {
    if (status === "success") {
      setAdult(data.profile?.adult ?? false);

      setSelectedLanguage(data?.profile?.language ?? "en");
      setSelectedLocation(data?.profile?.region ?? "GB");
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
        <>
          <Head>
            <title>Settings - Tracktr.</title>
          </Head>
          <div className="max-w-6xl m-auto">
            <ProfileHeader image={String(data?.image)} name={String(data?.name)} currentPage="Settings" />
            <div className="p-4 mx-4 mt-16 text-white rounded-md md:max-w-md bg-zinc-900">
              <form onSubmit={onSubmit}>
                <p className="pb-6 text-2xl font-bold">Settings</p>
                <label className="flex items-center w-full pb-3">
                  <span className="w-1/2">Include 18+ content</span>
                  <input
                    type="checkbox"
                    className="w-6 h-6 ml-auto rounded-md outline-none text-primary"
                    onChange={() => setAdult(!adult)}
                    checked={adult}
                  />
                </label>

                <label className="flex items-center w-full pb-3">
                  <span className="w-1/2">Language</span>
                  <select
                    className="w-1/2 px-2 py-1 ml-auto rounded-md text-primaryBackground"
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    value={selectedLanguage}
                  >
                    {data &&
                      languages &&
                      Object.values(languages).map(({ english_name, iso_639_1 }: any) => (
                        <option key={iso_639_1} value={iso_639_1}>
                          {english_name}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="flex items-center w-full">
                  <span className="w-1/2">Region</span>
                  <select
                    className="w-1/2 px-2 py-1 ml-auto rounded-md text-primaryBackground"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    value={selectedLocation}
                  >
                    {data &&
                      watchRegions &&
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
                  {isLoading && <p className="ml-4">Saving...</p>}
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default ProfilePage;
