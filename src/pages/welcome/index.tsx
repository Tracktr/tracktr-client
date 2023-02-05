import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import slugify from "slugify";
import { trpc } from "../../utils/trpc";

const WelcomePage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [usernameUnique, setUsernameUnique] = useState<boolean | undefined>();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      setUsername(String(session.user?.profile.username));
    } else if (sessionStatus === "unauthenticated") {
      router.push("/");
    }
  }, [sessionStatus, session, router]);

  const checkUsernameUnique = trpc.profile.checkUsernameUnique.useQuery(
    {
      username,
    },
    { enabled: submitted, onSuccess: () => setSubmitted(false) }
  );

  useEffect(() => {
    if (checkUsernameUnique.status === "success") {
      if (!checkUsernameUnique.data.usernameUnique) {
        setUsernameError("Not unique");
      } else {
        setUsernameError("");
      }
    }
  }, [checkUsernameUnique]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubmitted(true);
    setUsernameError("");
    setUsername(slugify(e.currentTarget.value, ""));
  };

  const handleSubmit = () => {
    updateUsername.mutate({
      username,
    });
  };

  const updateUsername = trpc.profile.updateUsername.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: () => {
      toast("Failed to update username", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  return (
    <>
      <Head>
        <title>Tracktr.</title>
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
                className={`border text-sm rounded-lg block w-full p-2.5 disabled:cursor-not-allowed ${
                  usernameError
                    ? "text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 bg-red-100 border-red-400"
                    : "text-white placeholder-gray-400 bg-gray-700 focus:ring-blue-500 focus:border-blue-500 border-gray-600"
                }`}
                required
                disabled={updateUsername.isLoading}
                onChange={handleUsernameChange}
                value={username}
              />
              {usernameError && <p className={`mt-2 mb-6 text-sm text-red-400`}>Not unique</p>}
            </div>

            <button
              type="submit"
              className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
              onClick={handleSubmit}
              disabled={updateUsername.isLoading || Boolean(usernameError)}
            >
              {updateUsername.isLoading ? (
                <div className="flex items-center gap-2">
                  <ImSpinner2 className="animate-spin" />
                </div>
              ) : (
                <div>Next</div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
