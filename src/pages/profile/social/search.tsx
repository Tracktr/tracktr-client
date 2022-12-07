import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { CgSearch } from "react-icons/cg";
import { ImSpinner2 } from "react-icons/im";
import { useDebounce } from "use-debounce";
import ImageWithFallback from "../../../components/common/ImageWithFallback";
import ProfileHeader from "../../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../../utils/trpc";

const FollowersPage = () => {
  const router = useRouter();
  const session = useSession();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedValue] = useDebounce(searchInput, 1000);

  const {
    data: searchResults,
    fetchStatus,
    status: searchStatus,
    refetch,
    isRefetching,
  } = trpc.profile.usernameSearch.useQuery(
    { query: searchInput },
    {
      enabled: debouncedValue.length >= 3 && searchInput.length > 0,
    }
  );

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

  const addAsFollower = trpc.followers.createFollowers.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeAsFollower = trpc.followers.removeFollowers.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <>
      <Head>
        <title>Search users - Social - Tracktr.</title>
      </Head>

      <div className="max-w-6xl m-auto">
        <ProfileHeader
          image={String(session.data?.user?.image)}
          currentPage="Social"
          name={String(session.data?.user?.name)}
        />
        <div className="mx-4 md:mx-0">
          <div className="my-10">
            <h1 className="my-5 text-3xl">Search users</h1>
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
                      <div key={profile?.username} className="flex flex-col items-center">
                        <Link href={`/profile/${profile?.username}`}>
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
                        <button
                          className="px-3 py-1 text-sm text-center rounded-full bg-primary text-primaryBackground"
                          onClick={() => {
                            if (profile?.user?.followers?.length !== 1) {
                              addAsFollower.mutate({ follower: String(profile?.user?.id) });
                            }
                            removeAsFollower.mutate({ follower: String(profile?.user?.id) });
                          }}
                        >
                          {addAsFollower.isLoading || removeAsFollower.isLoading || isRefetching ? (
                            <div className="flex items-center gap-2">
                              <ImSpinner2 className="animate-spin" />
                              Loading
                            </div>
                          ) : profile?.user?.followers?.length === 1 ? (
                            <div>Unfollow</div>
                          ) : (
                            <div>Follow</div>
                          )}
                        </button>
                      </div>
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
        </div>
      </div>
    </>
  );
};

export default FollowersPage;
