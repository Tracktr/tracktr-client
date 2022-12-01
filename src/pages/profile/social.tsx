import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { CgSearch } from "react-icons/cg";
import ImageWithFallback from "../../components/common/ImageWithFallback";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const FollowersPage = () => {
  const router = useRouter();
  const session = useSession();
  const [searchInput, setSearchInput] = useState("");

  const { data, status } = trpc.profile.profileBySession.useQuery();

  useEffect(() => {
    if (session.status === "unauthenticated") {
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
              <div>
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
                    <CgSearch size={24} className="mx-5" />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="my-5 text-3xl">Following</h1>
                <div className="flex">
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
              <div>
                <h1 className="my-5 text-3xl">Followers</h1>
                <div className="flex">
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
            </div>
          );
        }}
      </LoadingPageComponents>
    </div>
  );
};

export default FollowersPage;
