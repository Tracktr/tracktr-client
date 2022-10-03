/* eslint-disable react/button-has-type */
import { useSession, signOut, signIn } from "next-auth/react";
import { NextPage } from "next/types";

const Signin: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="pt-32">
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className="pt-32">
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
};

export default Signin;
