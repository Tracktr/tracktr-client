import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push(`/profile/${session.data.user?.profile.username}`);
    }
  }, [session, router]);

  return <></>;
};

export default ProfilePage;
