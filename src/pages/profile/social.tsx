import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { CgSearch } from "react-icons/cg";
import { ImSpinner2 } from "react-icons/im";
import { useDebounce } from "use-debounce";
import ImageWithFallback from "../../components/common/ImageWithFallback";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const FollowersPage = () => {
  const router = useRouter();
  const session = useSession();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedValue] = useDebounce(searchInput, 1000);

  const {
    data: searchResults,
    fetchStatus,
    status: searchStatus,
  } = trpc.profile.usernameSearch.useQuery(
    { query: searchInput },
    {
      enabled: debouncedValue.length >= 3 && searchInput.length > 0,
    }
  );

  const { data, status } = trpc.profile.profileBySession.useQuery();

  useEffect(() => {
    if (session.status !== "loading" && session.status === "unauthenticated") {
      router.push(`/`);
    }
  }, [session, router]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchInput(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-6xl m-auto">
      <ProfileHeader
        image={String(session.data?.user?.image)}
        currentPage="Social"
        name={String(session.data?.user?.name)}
      />
      <LoadingPageComponents status={status}>
        {() => {
          return (
            <div className="mx-4 md:mx-0">
              <div className="my-10">
                <h1 className="my-5 text-3xl">Search</h1>
                <div className="relative max-w-sm">
                  <div className="flex items-center py-2 mt-2 text-gray-500 bg-white rounded-full">
                    <input
                      className="w-full px-5 py-1 rounded-full outline-none"
                      type="text"
                      placeholder="Search username"
                      value={searchInput}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                    />
                    {fetchStatus === "fetching" ? (
                      <ImSpinner2 size={24} className="mx-5 animate-spin" />
                    ) : (
                      <CgSearch size={24} className="mx-5" />
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  {searchStatus === "success" && searchResults.results?.length > 0 && searchInput.length > 0 ? (
                    <div className="flex gap-4">
                      {searchResults.results?.map((profile) => {
                        return (
                          <Link href={`/profile/${profile?.username}`} key={profile?.username}>
                            <a className="flex flex-col items-center">
                              <ImageWithFallback
                                src={profile.user.image}
                                fallbackSrc="/placeholder_profile.png"
                                width="96"
                                height="96"
                                alt="Profile picture"
                                className="rounded-full"
                              />
                              <p className="text-sm">{profile?.username}</p>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    debouncedValue.length >= 3 &&
                    fetchStatus !== "fetching" &&
                    searchInput.length > 0 && <div>No results</div>
                  )}
                </div>
              </div>
              {!searchResults && fetchStatus !== "fetching" && (
                <>
                  <div className="my-10">
                    <h1 className="my-5 text-3xl">Following</h1>
                    <div className="flex gap-4">
                      {data?.following && data?.following?.length > 0 ? (
                        data?.following?.map((user) => {
                          return (
                            <Link href={`/profile/${user.profile?.username}`} key={user.name}>
                              <a className="flex flex-col items-center">
                                <ImageWithFallback
                                  src={user.image}
                                  fallbackSrc="/placeholder_profile.png"
                                  width="96"
                                  height="96"
                                  alt="Profile picture"
                                  className="rounded-full"
                                />
                                <p className="text-sm">{user.profile?.username}</p>
                              </a>
                            </Link>
                          );
                        })
                      ) : (
                        <div>No followers</div>
                      )}
                    </div>
                  </div>
                  <div className="my-10">
                    <h1 className="my-5 text-3xl">Followers</h1>
                    <div className="flex gap-4">
                      {data?.followers && data?.followers?.length > 0 ? (
                        data?.followers?.map((user) => {
                          return (
                            <Link href={`/profile/${user.profile?.username}`} key={user.name}>
                              <a className="flex flex-col items-center">
                                <ImageWithFallback
                                  src={user.image}
                                  fallbackSrc="/placeholder_profile.png"
                                  width="96"
                                  height="96"
                                  alt="Profile picture"
                                  className="rounded-full"
                                />
                                <p className="text-sm">{user.profile?.username}</p>
                              </a>
                            </Link>
                          );
                        })
                      ) : (
                        <div>Not following any users</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        }}
      </LoadingPageComponents>
    </div>
  );
};

export default FollowersPage;
