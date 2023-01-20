import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const FeedbackPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated" && status !== "loading") {
      router.push("/");
    }
  });

  return (
    <>
      <Head>
        <title>Feedback form - Tracktr.</title>
      </Head>

      <div className="pt-24">
        <div className="py-10 text-white sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Feedback form</h2>
              <p className="mx-auto mt-4 text-base leading-relaxed">
                If you see something that isn&apos;t working quite right or you have an awesome idea for a new feature
                you can leave a message on this page and we&apos;ll take a look at it. If you have a GitHub account, you
                can also create an issue on{" "}
                <a
                  className="underline"
                  href="https://github.com/Tracktr/tracktr-client/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  our repository here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;
