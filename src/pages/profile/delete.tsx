import { useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosRemove, IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import { trpc } from "../../utils/trpc";

const DeleteAccountPage = () => {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = trpc.profile.deleteProfile.useMutation({
    onSuccess: () => {
      toast("Account deleted", {
        icon: <IoIosRemove className="text-3xl text-green-500" />,
      });
      queryClient.invalidateQueries();
      signOut({ callbackUrl: "/" });
    },
    onError: () => {
      toast("Failed to remove account", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  useEffect(() => {
    if (session.status === "unauthenticated" && status !== "loading") {
      router.push("/");
    }
  });

  return (
    <>
      <Head>
        <title>Delete account - Tracktr.</title>
      </Head>

      <div className="pt-24">
        <div className="py-10 text-white sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Delete account</h2>
              <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed">
                You can delete here, this will delete all your data stored by us and cannot be undone. Are you sure?
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => mutate()}
            className="px-8 py-3 text-2xl font-semibold text-center rounded-md outline-none text-primaryBackground bg-primary"
          >
            {isLoading ? (
              <div className="flex items-center gap-5">
                <ImSpinner2 className="animate-spin" />
                <div>Saving...</div>
              </div>
            ) : (
              <div>Yes, I&apos;m sure</div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountPage;
