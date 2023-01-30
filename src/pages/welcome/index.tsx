import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import slugify from "slugify";

const WelcomePage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      setUsername(slugify(String(session?.user?.name), ""));
    } else if (sessionStatus === "unauthenticated") {
      router.push("/");
    }
  }, [sessionStatus, session?.user?.name, router]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(slugify(e.currentTarget.value, ""));
  };

  return (
    <>
      <Head>
        <title>Feedback form - Tracktr.</title>
      </Head>

      <div className="pt-24">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <div className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Welcome to tracktr</div>

          <div className="max-w-2xl mx-auto mt-8 text-left text-black">
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`border text-sm rounded-lg block w-full p-2.5 disabled:cursor-not-allowed`}
                required
                onChange={handleUsernameChange}
                value={username}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
