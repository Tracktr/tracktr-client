import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import slugify from "slugify";
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
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      setUsername(String(session.data.user?.profile.username));
    } else if (session.status === "unauthenticated") {
      router.push("/404");
    }
  }, [session, router]);

  const checkUsernameUnique = trpc.profile.checkUsernameUnique.useQuery(
    {
      username,
    },
    { enabled: submitted },
  );

  useEffect(() => {
    if (checkUsernameUnique.status === "success") {
      setSubmitted(false);
      if (
        !checkUsernameUnique.data.usernameUnique &&
        username.toLowerCase() !== session.data?.user?.profile.username.toLocaleLowerCase()
      ) {
        setUsernameError("Not unique");
      } else {
        setUsernameError("");
      }
    }
  }, [checkUsernameUnique, session, username]);

  const { mutate, isPending } = trpc.profile.updateProfile.useMutation({
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

  const handleSubmit = () => {
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

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubmitted(true);
    setUsernameError("");
    setUsername(slugify(e.currentTarget.value, ""));
  };

  return (
    <>
      <Head>
        <title>Settings - Tracktr.</title>
      </Head>

      <LoadingPageComponents status={status}>
        {() => (
          <>
            <Head>
              <title>{session.data?.user?.name}&apos;s History - Tracktr.</title>
            </Head>

            <div className="max-w-6xl m-auto">
              <ProfileHeader
                image={String(data?.image)}
                name={String(data?.profile?.username)}
                currentPage="Settings"
              />

              <div className="p-4 my-5">
                <h1 className="mb-2 text-3xl">Settings</h1>

                <div className="md:max-w-xl">
                  <div className="flex">
                    <label htmlFor="adult">Include 18+ content</label>
                    <input
                      id="adult"
                      type="checkbox"
                      className="w-6 h-6 my-1 ml-auto rounded-md outline-none text-primary"
                      onChange={() => setAdult(!adult)}
                      checked={adult}
                    />
                  </div>

                  <div className="flex">
                    <label htmlFor="private">Private profile</label>
                    <input
                      id="private"
                      type="checkbox"
                      className="w-6 h-6 my-1 ml-auto rounded-md outline-none text-primary"
                      onChange={() => setPrivate(!privateProfile)}
                      checked={privateProfile}
                    />
                  </div>

                  <div className="flex">
                    <label htmlFor="language">Language</label>
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
                  </div>

                  <div className="flex">
                    <label htmlFor="region">Region</label>
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
                  </div>

                  <div className="flex">
                    <label htmlFor="username">Username</label>

                    <input
                      type="text"
                      id="username"
                      className={`w-1/2 ml-auto py-0.5 px-3 rounded disabled:cursor-not-allowed ${
                        usernameError
                          ? "text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 bg-red-100 border-red-400"
                          : "text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 border-gray-600"
                      }`}
                      required
                      disabled={isPending}
                      onChange={handleUsernameChange}
                      value={username}
                    />
                  </div>
                  {usernameError && <p className={`mt-2 mb-6 text-sm text-red-400`}>Username is not unique</p>}

                  <div className="flex items-center w-full gap-2 mt-12">
                    <button
                      className="px-8 py-3 text-base font-semibold text-center rounded-md outline-none text-primaryBackground bg-primary disabled:bg-gray-700 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={isPending || Boolean(usernameError)}
                      onClick={handleSubmit}
                    >
                      {isPending ? (
                        <div className="flex items-center gap-5">
                          <ImSpinner2 className="animate-spin" />
                          <div>Saving...</div>
                        </div>
                      ) : (
                        <div>Save Settings</div>
                      )}
                    </button>
                    <Link href="/profile/delete" className="ml-auto text-center text-gray-400">
                      Delete account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default ProfilePage;
