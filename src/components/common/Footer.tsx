import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const session = useSession();

  return (
    <footer className="relative pt-32 pb-6 bg-[#1A1A1A]">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap text-left lg:text-left">
          <div className="max-w-xl px-4 m-auto lg:w-6/12">
            <div className="mb-6 lg:mb-0">
              <Link href="https://www.themoviedb.org/" target="_blank">
                <a>
                  <Image src="/tmdb_logo.svg" width="128" height="64" alt="TMDB Logo" />
                </a>
              </Link>
            </div>
          </div>
          <div className="w-full px-4 lg:w-6/12">
            <div className="flex flex-wrap mb-6 items-top">
              {session.status === "authenticated" && (
                <div className="w-full px-4 ml-auto lg:w-4/12">
                  <span className="block mb-2 text-sm font-semibold uppercase">Account</span>
                  <ul className="list-unstyled">
                    <li>
                      <Link href="/profile">
                        <a className="block pb-2 text-sm">Profile</a>
                      </Link>
                      <Link href="/profile/history">
                        <a className="block pb-2 text-sm">History</a>
                      </Link>
                      <Link href="/profile/social">
                        <a className="block pb-2 text-sm">Social</a>
                      </Link>
                      <Link href="/profile/watchlist">
                        <a className="block pb-2 text-sm">Watchlist</a>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              <div className="w-full px-4 mt-0 ml-auto md:mt-2 lg:w-4/12">
                <span className="block mb-2 text-sm font-semibold uppercase">Find Content</span>
                <ul className="list-unstyled">
                  <li>
                    <Link href="/movies">
                      <a className="block pb-2 text-sm">Movies</a>
                    </Link>
                    <Link href="/tv">
                      <a className="block pb-2 text-sm">Series</a>
                    </Link>
                    <Link href="/calendar">
                      <a className="block pb-2 text-sm">Release calendar</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center pt-4 md:justify-between">
          <div className="w-full px-4 mx-auto text-center md:w-4/12">
            <div className="py-1 text-sm">
              Copyright © {new Date().getFullYear()} - Developed by{" "}
              <Link href="https://rowanpaulflynn.com/" target="_blank">
                <a>Rowan</a>
              </Link>
              <span className="px-1">&</span>
              <Link href="https://patrickroelofs.com/" target="_blank">
                <a>Patrick</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
