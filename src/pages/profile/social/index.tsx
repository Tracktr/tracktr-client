import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ImageWithFallback from "../../../components/common/ImageWithFallback";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import ProfileHeader from "../../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../../utils/trpc";

const FollowersPage = () => {
  const router = useRouter();
  const session = useSession();

  const { data, status } = trpc.profile.profileBySession.useQuery();

  useEffect(() => {
    if (session.status !== "loading" && session.status === "unauthenticated") {
      router.push(`/`);
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Social - Tracktr.</title>
      </Head>

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
                  <div className="items-center align-middle md:flex">
                    <div className="flex items-center justify-between w-full gap-4 mb-5">
                      <div className="flex items-center justify-center text-xl md:text-3xl">
                        Following ({data?.following?.length})
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-5">
                    {data?.following && data?.following?.length > 0 ? (
                      data?.following?.map((user) => {
                        return (
                          <Link href={`/profile/${user.profile?.username}`} key={user.name}>
                            <a className="flex flex-col items-center max-w-[100px] justify-center">
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

                  <Link href="/profile/social/search">
                    <a className="px-3 py-1 text-sm text-center rounded-full bg-primary text-primaryBackground">
                      Search users
                    </a>
                  </Link>
                </div>
                <div className="my-10">
                  <h1 className="my-5 text-3xl">Followers ({data?.followers?.length})</h1>
                  <div className="flex flex-wrap gap-4">
                    {data?.followers && data?.followers?.length > 0 ? (
                      data?.followers?.map((user) => {
                        return (
                          <Link href={`/profile/${user.profile?.username}`} key={user.name}>
                            <a className="flex flex-col items-center max-w-[100px]">
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
    </>
  );
};

export default FollowersPage;
