import Head from "next/head";
import SearchInput from "../components/search/SearchInput";

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found - Tracktr.</title>
      </Head>

      <div className="pt-24">
        <div className="py-10 text-white sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Page not found</h2>
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

export default NotFoundPage;
