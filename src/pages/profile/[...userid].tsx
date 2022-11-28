import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ImSpinner2 } from "react-icons/im";
import { MdOutlineWrapText } from "react-icons/md";
import HistoryGrid from "../../components/common/HistoryGrid";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const PublicProfile = () => {
  const router = useRouter();
  const session = useSession();

  const {
    data: profile,
    status: profileStatus,
    refetch,
    isRefetching,
  } = trpc.profile.profileById.useQuery(
    {
      user: String(router.query.userid),
    },
    { enabled: router.isReady }
  );

  const addAsFriend = trpc.profile.createFriend.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeAsFriend = trpc.profile.removeFriend.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <LoadingPageComponents status={profileStatus}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={String(profile?.image)} name={String(profile?.name)} />

          {session.status === "authenticated" && (
            <button
              className="inline-flex items-center px-6 py-4 my-6 font-semibold text-black transition-all duration-200 rounded-full bg-primary lg:mt-16"
              role="button"
              onClick={() => {
                if (profile?.friends?.length !== 1) {
                  addAsFriend.mutate({ friend: String(profile?.id) });
                }
                removeAsFriend.mutate({ friend: String(profile?.id) });
              }}
              disabled={addAsFriend.isLoading || removeAsFriend.isLoading}
            >
              {addAsFriend.isLoading || removeAsFriend.isLoading || isRefetching ? (
                <div className="flex gap-4">
                  <ImSpinner2 className="w-6 h-6 animate-spin" />
                  Loading
                </div>
              ) : profile?.friends?.length === 1 ? (
                <div>Remove as friends</div>
              ) : (
                <div>Add as friend</div>
              )}
            </button>
          )}

          <div className="my-6">
            <div className="items-center align-middle md:flex">
              <div className="flex items-center justify-between w-full gap-4 mb-5">
                <div className="flex items-center justify-center text-xl md:text-3xl">
                  <MdOutlineWrapText className="mr-4" />
                  Recently watched episodes
                </div>
              </div>
            </div>
            <HistoryGrid
              hasScrollContainer
              history={profile?.EpisodesHistory || []}
              status={profileStatus}
              refetch={refetch}
              inPublic={true}
            />
          </div>
          <div className="my-6">
            <div className="items-center align-middle md:flex">
              <div className="flex items-center justify-between w-full gap-4 mb-5">
                <div className="flex items-center justify-center text-xl md:text-3xl">
                  <MdOutlineWrapText className="mr-4" />
                  Recently watched movies
                </div>
              </div>
            </div>
            <HistoryGrid
              hasScrollContainer
              history={profile?.MoviesHistory || []}
              status={profileStatus}
              refetch={refetch}
              inPublic={true}
            />
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default PublicProfile;
