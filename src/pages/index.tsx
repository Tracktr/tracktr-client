import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { IoIosArrowUp } from "react-icons/io";

const Home: NextPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [openFAQ1, setOpenFAQ1] = useState(true);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/dashboard");
    }
  });

  return (
    <div>
      <section className="bg-primaryBackground 2xl:py-24">
        <div className="px-4 mx-auto bg-black max-w-7xl sm:px-6 lg:px-8 2xl:rounded-xl">
          <div className="py-10 sm:py-16 lg:py-24 2xl:pl-24">
            <div className="grid items-center grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-8 2xl:gap-x-20">
              <div className="relative lg:order-2 2xl:-mr-24">
                <Image alt="product image" src="/product_image.png" width={1625} height={782} />
              </div>

              <div className="lg:order-1">
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-snug">
                  Are you ready to <br className="hidden xl:block" />
                  join Tracktr?
                </h2>

                <ul className="grid grid-cols-1 mt-4 sm:mt-10 sm:grid-cols-2 gap-x-10 xl:gap-x-16 gap-y-4 xl:gap-y-6">
                  <li className="flex items-center">
                    <AiFillCheckCircle className="flex-shrink-0 w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium text-white">Keep track of your watched shows and movies.</span>
                  </li>

                  <li className="flex items-center">
                    <AiFillCheckCircle className="flex-shrink-0 w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium text-white">Find new things to watch.</span>
                  </li>

                  <li className="flex items-center">
                    <AiFillCheckCircle className="flex-shrink-0 w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium text-white">
                      Find where movies and shows are streaming in your location
                    </span>
                  </li>
                </ul>

                <div className="flex flex-col items-start mt-8 sm:space-x-4 sm:flex-row sm:items-center lg:mt-12">
                  <button
                    onClick={() => signIn()}
                    title=""
                    className="inline-flex items-center justify-center px-4 py-4 text-base font-semibold text-black transition-all duration-200 border border-transparent rounded-md bg-primary"
                    role="button"
                  >
                    Create an account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto mt-8 space-y-4 text-black md:mt-16">
            <div className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50">
              <button
                onClick={() => setOpenFAQ1(!openFAQ1)}
                type="button"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
              >
                <span className="flex text-lg font-semibold text-black"> How to create an account? </span>
                <IoIosArrowUp className="w-6 h-6 text-gray-400" />
              </button>

              <div className={`px-4 pb-5 sm:px-6 sm:pb-6 ${openFAQ1 !== false ? "hidden" : ""}`}>
                <p>
                  Creating an account is done with one click! <br />
                  Just press sign in and use one of your social media accounts to sign in!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
