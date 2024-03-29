import Head from "next/head";
import SearchInput from "../components/search/SearchInput";

const ServerErrorPage = () => {
  return (
    <>
      <Head>
        <title>Something went wrong - Tracktr.</title>
      </Head>

      <div
        className="flex flex-col items-center justify-center min-h-screen gap-10 align-middle"
        style={{
          background: `linear-gradient(0deg, #1A1A1A 3.79%, rgba(16, 16, 16, 0) 100%), url(https://www.themoviedb.org/t/p/original/2x6P4OGdvf4LVmcwb4ra1AfN3d7.jpg) no-repeat center`,
          backgroundSize: "cover",
        }}
      >
        <div className="text-white">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Something went wrong</h2>
              <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed">
                Looks like something went wrong... Maybe try going back or searching below for where you wanted to go.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-md mx-auto ">
          <SearchInput type="multi" />
        </div>
      </div>
    </>
  );
};

export default ServerErrorPage;
