import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import { useScroll, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PosterImage } from "../../utils/generateImages";
import { IoMdFemale, IoMdMale } from "react-icons/io";

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
          <div className="absolute w-screen max-w-full h-64 md:h-[32rem] top-0 left-0">
            <div className="relative w-full h-full bg-gradient-to-t from-primaryBackground" />
          </div>

          <div className="relative w-full">
            <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">
              <div className="col-span-1 mx-4 text-center">
                <div className="sticky inline-block top-16 max-w-[216px] w-full ">
                  <motion.div
                    animate={{
                      overflow: "hidden",
                      width: scrollPosition > 300 ? "150px" : "auto",
                      height: "auto",
                      transition: {
                        bounce: 0,
                      },
                    }}
                    className="m-auto border-4 rounded-md border-primaryBackground"
                  >
                    <Image
                      alt={"Poster image for:" + data.name}
                      width="208"
                      height="311"
                      src={PosterImage({ path: data.profile_path, size: "lg" })}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="col-span-3 px-4">
                <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
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
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default PersonPage;
