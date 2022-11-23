import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { IoIosArrowUp } from "react-icons/io";
import { BsFillEmojiHeartEyesFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineLiveTv } from "react-icons/md";

const Home: NextPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [openFAQ, setOpenFAQ] = useState({
    faq1: false,
    faq2: false,
  });

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/dashboard");
    }
  });

  return (
    <div>
      <section className="py-16 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mt-4 text-4xl font-bold lg:mt-8 sm:text-6xl xl:text-8xl">
                Track the best movies and shows.
              </h1>
              <p className="mt-4 text-base lg:mt-8 sm:text-xl">
                Create a database connected to all streaming services.
              </p>

              <button
                onClick={() => signIn()}
                className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 rounded-full bg-primary lg:mt-16"
                role="button"
              >
                Create or sign in
                <svg
                  className="w-6 h-6 ml-8 -mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            <div>
              <Image
                width={1278}
                height={694}
                src="/product_image.png"
                className="w-full rounded-md"
                alt="product image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2 md:grid-cols-3 lg:gap-y-16">
            <div>
              <div className="relative flex items-center justify-center mx-auto">
                <BsFillEmojiHeartEyesFill className="absolute text-primary w-9 h-9" />
              </div>
              <h3 className="mt-8 text-lg font-semibold">Tracking</h3>
              <p className="mt-4 text-base">
                Keep track of every film and series you&apos;ve ever watched, or start tracking from today.
              </p>
            </div>

            <div>
              <div className="relative flex items-center justify-center mx-auto">
                <FaUserFriends className="absolute text-primary w-9 h-9" />
              </div>
              <h3 className="mt-8 text-lg font-semibold">Friends & Reviews</h3>
              <p className="mt-4 text-base">
                Write and share reviews, find friends and connect through your favorite content!
              </p>
            </div>

            <div>
              <div className="relative flex items-center justify-center mx-auto">
                <MdOutlineLiveTv className="absolute text-primary w-9 h-9" />
              </div>
              <h3 className="mt-8 text-lg font-semibold">Streaming Services</h3>
              <p className="mt-4 text-base">
                Keep watch over all your subscribed streaming services and let us connect it to the tv-show or movie.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primaryBackground 2xl:py-24">
        <div className="px-4 mx-auto bg-black max-w-7xl sm:px-6 lg:px-8 2xl:rounded-xl">
          <div className="py-10 sm:py-16 lg:py-24 2xl:pl-24">
            <div className="grid items-center grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-8 2xl:gap-x-20">
              <div className="relative lg:order-2 2xl:-mr-24">
                <Image
                  className="w-full rounded-md"
                  alt="product image"
                  src="/product_image.png"
                  width={1278}
                  height={694}
                />
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
                      Find where movies and shows are streaming in your location.
                    </span>
                  </li>

                  <li className="flex items-center">
                    <AiFillCheckCircle className="flex-shrink-0 w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium text-white">Open source and regularly updated.</span>
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
                onClick={() =>
                  setOpenFAQ({
                    faq1: !openFAQ.faq1,
                    faq2: openFAQ.faq2,
                  })
                }
                type="button"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
              >
                <span className="flex text-lg font-semibold text-black"> How to create an account? </span>
                <IoIosArrowUp className="w-6 h-6 text-gray-400" />
              </button>

              <div className={`px-4 pb-5 sm:px-6 sm:pb-6 ${openFAQ.faq1 === true ? "" : "hidden"}`}>
                <p>
                  Creating an account is done with one click! <br />
                  Just press sign in and use one of your social media accounts to sign in!
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-8 space-y-4 text-black md:mt-4">
            <div className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50">
              <button
                onClick={() =>
                  setOpenFAQ({
                    faq1: openFAQ.faq1,
                    faq2: !openFAQ.faq2,
                  })
                }
                type="button"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
              >
                <span className="flex text-lg font-semibold text-black"> Whats your pricing? </span>
                <IoIosArrowUp className="w-6 h-6 text-gray-400" />
              </button>

              <div className={`px-4 pb-5 sm:px-6 sm:pb-6 ${openFAQ.faq2 === true ? "" : "hidden"}`}>
                <p>We&apos;re free, but we might add subscriptions later.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
