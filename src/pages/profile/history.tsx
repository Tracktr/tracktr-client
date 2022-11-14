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

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={data?.image} name={data?.name} />
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default ProfilePage;
