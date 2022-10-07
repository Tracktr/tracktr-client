import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import Logo from "../../components/common/Logo";

export default function SignIn({ providers }: any) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [router, status]);

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex-col justify-between hidden lg:flex bg-primary text-primaryBackground lg:p-8 xl:p-12 lg:max-w-md xl:max-w-xl">
        <Logo textColor="text-primaryBackground" dotColor="text-primaryBackground" />
        <div className="space-y-5">
          <h1 className="font-extrabold lg:text-3xl xl:text-5xl xl:leading-snug">
            Sign in and customize your Tracktr experience.
          </h1>
        </div>
        <p className="font-medium">© {new Date().getFullYear()} Tracktr</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 space-y-5">
        <div className="max-w-xl p-12 rounded-md h-1/2">
          <div className="flex flex-col space-y-2 text-center">
            <h2 className="pb-4 text-3xl font-bold md:text-6xl">Sign in</h2>
            <p className="text-md">With socials logging in is one button away!</p>
          </div>
          <div className="flex flex-col max-w-xs pt-12 m-auto space-y-5">
            {Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                {provider.name === "GitHub" && (
                  <button
                    className="bg-[#212428] text-white w-full px-4 py-4 flex rounded-md"
                    type="button"
                    onClick={() => signIn(provider.id)}
                  >
                    <FaGithub className="mr-4 text-2xl" />
                    Sign in with {provider.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
