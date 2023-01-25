import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
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
  const [privateProfile, setPrivate] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const { mutate, isLoading } = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast("Updated settings", {
        icon: <IoMdInformation className="text-3xl text-green-500" />,
      });
    },
    onError: () => {
      toast("Failed to update settings", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const onSubmit = (event: any) => {
    event.preventDefault();

    mutate({
      adult,
      private: privateProfile,
      language: selectedLanguage,
      region: selectedLocation,
    });
  };

  useEffect(() => {
    if (status === "success") {
      setAdult(data.profile?.adult ?? false);
      setPrivate(data.profile?.private ?? false);

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
    <>
      <Head>
        <title>Settings - Tracktr.</title>
      </Head>
      <LoadingPageComponents status={status}>
        {() => (
          <div className="max-w-6xl m-auto">
            <ProfileHeader image={String(data?.image)} name={String(data?.name)} currentPage="Settings" />
            <div className="p-4 mx-4 mt-16 text-white rounded-md md:max-w-md bg-zinc-900">
              <form onSubmit={onSubmit}>
                <p className="pb-6 text-2xl font-bold">Settings</p>

                <label className="flex items-center w-full" htmlFor="adult">
                  <span className="w-1/2">Include 18+ content</span>
                  <input
                    id="adult"
                    type="checkbox"
                    className="w-6 h-6 my-1 ml-auto rounded-md outline-none text-primary"
                    onChange={() => setAdult(!adult)}
                    checked={adult}
                  />
                </label>

                <label className="flex items-center w-full" htmlFor="private">
                  <span className="w-1/2">Private profile</span>
                  <input
                    id="private"
                    type="checkbox"
                    className="w-6 h-6 my-1 ml-auto rounded-md outline-none text-primary"
                    onChange={() => setPrivate(!privateProfile)}
                    checked={privateProfile}
                  />
                </label>

                <label className="flex items-center w-full" htmlFor="language">
                  <span className="w-1/2">Language</span>
                  <select
                    id="language"
                    className="w-1/2 px-2 py-1 my-1 ml-auto rounded-md text-primaryBackground"
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    value={selectedLanguage}
                  >
                    {data &&
                      languages &&
                      Object.values(languages)
                        .sort((a: any, b: any) => a.english_name.localeCompare(b.english_name))
                        .map(({ english_name, iso_639_1 }: any) => (
                          <option key={iso_639_1} value={iso_639_1}>
                            {english_name}
                          </option>
                        ))}
                  </select>
                </label>

                <label className="flex items-center w-full" htmlFor="region">
                  <span className="w-1/2">Region</span>
                  <select
                    className="w-1/2 px-2 py-1 my-1 ml-auto rounded-md text-primaryBackground"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    value={selectedLocation}
                    id="region"
                  >
                    {data &&
                      watchRegions &&
                      Object.values(watchRegions.results)
                        .sort((a: any, b: any) => a.english_name.localeCompare(b.english_name))
                        .map(({ english_name, iso_3166_1 }: any) => (
                          <option key={iso_3166_1} value={iso_3166_1}>
                            {english_name}
                          </option>
                        ))}
                  </select>
                </label>

                <div className="flex items-center w-full gap-2 mt-12">
                  <button
                    className="px-8 py-3 text-base font-semibold text-center rounded-md outline-none text-primaryBackground bg-primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-5">
                        <ImSpinner2 className="animate-spin" />
                        <div>Saving...</div>
                      </div>
                    ) : (
                      <div>Save Settings</div>
                    )}
                  </button>
                  <Link href="/profile/delete">
                    <a className="ml-auto text-center text-gray-400">Delete account</a>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default ProfilePage;
