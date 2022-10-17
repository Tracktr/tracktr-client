import { getSession } from "next-auth/react";

const ProfilePage = ({ session }: any) => <p className="pt-64 text-6xl text-center">{session.user.name}</p>;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default ProfilePage;
