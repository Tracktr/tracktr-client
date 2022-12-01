import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";

const FollowersPage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push(`/`);
    }
  }, [session, router]);

  return (
    <div className="max-w-6xl m-auto">
      <ProfileHeader
        image={String(session.data?.user?.image)}
        currentPage="Followers"
        name={String(session.data?.user?.name)}
      />
    </div>
  );
};

export default FollowersPage;
