import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import { useScroll, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PosterImage } from "../../utils/generateImages";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import ContentBackdrop from "../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../components/pageBlocks/ContentPoster";
import ContentTitle from "../../components/pageBlocks/ContentTitle";
import ContentOverview from "../../components/pageBlocks/ContentOverview";

const PersonPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, status } = trpc.person.personById.useQuery({ slug: slug ? slug[0] : undefined });
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollPosition(latest);
    });
  }, [scrollY]);

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <ContentBackdrop />

          <div className="relative w-full">
            <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">
              <ContentPoster
                title={data.name}
                poster={data.profile_path}
                id={data.id}
                theme_color={data.theme_color}
                hideWatchButton
              />

              <div className="col-span-3 px-4">
                {/* <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
                  <div className="items-center justify-between md:flex">
                    <h1 className="flex items-end max-w-2xl">
                      {data.gender === 1 && <IoMdFemale className="mr-2 text-pink-500" />}
                      {data.gender === 2 && <IoMdMale className="mr-2 text-blue-500" />}

                      <div>{data.name}</div>
                    </h1>
                  </div>
                </div>

                <div className="grid-cols-5 lg:grid">
                  <p className="max-w-full col-span-3 pt-8 lg:pb-12">{data.biography}</p>
                </div> */}
                <ContentTitle theme_color={data.theme_color} title={data.name} gender={data.gender} />
                <ContentOverview name={data.name} overview={data.biography} theme_color={data.theme_color} />
              </div>
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default PersonPage;
