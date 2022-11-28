import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const PublicProfile = () => {
  const router = useRouter();

  const { data: profile, status: profileStatus } = trpc.profile.profileById.useQuery(
    {
      user: String(router.query.userid),
    },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={profileStatus}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={String(profile?.image)} name={String(profile?.name)} />
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default PublicProfile;
