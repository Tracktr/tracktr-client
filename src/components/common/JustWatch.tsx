import { BiCameraMovie } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import HorizontalScrollContainer from "./HorizontalScrollContainer";
import Image from "next/image";
import Link from "next/link";
import { IThemeColor } from "../watchButton/BaseWatchButton";
import Modal from "../modal/Modal";

interface IProvider {
  name: string;
  url: string;
  searchUrl: string;
}

interface Providers {
  Netflix: IProvider;
  "Amazon Video": IProvider;
  "Amazon Prime Video": IProvider;
  "Apple iTunes": IProvider;
  "Microsoft Store": IProvider;
  "Rakuten TV": IProvider;
  "Google Play Movies": IProvider;
  "Sky Store": IProvider;
  Chili: IProvider;
  YouTube: IProvider;
  "Pathé Thuis": IProvider;
  KPN: IProvider;
  "Netflix basic with Ads": IProvider;
  meJane: IProvider;
  "Paramount+ Amazon Channel": IProvider;
}

export const providers: Providers = {
  "Amazon Video": {
    name: "Amazon Video",
    url: "https://www.primevideo.com/",
    searchUrl: "https://www.primevideo.com/search/?phrase=",
  },
  "Amazon Prime Video": {
    name: "Amazon Video",
    url: "https://www.primevideo.com/",
    searchUrl: "https://www.primevideo.com/search/?phrase=",
  },
  "Apple iTunes": {
    name: "Apple iTunes",
    url: "https://tv.apple.com/",
    searchUrl: "https://tv.apple.com/search?term=",
  },
  Chili: {
    name: "Chili",
    url: "https://uk.chili.com/",
    searchUrl: "https://uk.chili.com/search?q=",
  },
  "Google Play Movies": {
    name: "Google Play Movies",
    url: "https://play.google.com/store/movies",
    searchUrl: "https://play.google.com/store/search?c=movies&q=",
  },
  KPN: {
    name: "KPN",
    url: "https://tv.kpn.com",
    searchUrl: "https://tv.kpn.com/zoekresultaten?q=",
  },
  "Pathé Thuis": {
    name: "Pathé Thuis",
    url: "https://www.pathe-thuis.nl",
    searchUrl: "https://www.pathe-thuis.nl/zoeken?q=",
  },
  "Sky Store": {
    name: "Sky Store",
    url: "https://www.skystore.com/",
    searchUrl: "https://www.skystore.com/search?q=",
  },
  meJane: {
    name: "meJane",
    url: "https://www.mejane.com",
    searchUrl: "https://www.mejane.com/films/zoeken.html#",
  },
  "Microsoft Store": {
    name: "Microsoft Store",
    url: "https://www.microsoft.com/store/movies-and-tv",
    searchUrl: "https://www.microsoft.com/search/explore?q=",
  },
  Netflix: {
    name: "Netflix",
    url: "https://www.netflix.com/",
    searchUrl: "https://www.netflix.com/search?q=",
  },
  "Netflix basic with Ads": {
    name: "Netflix basic with Ads",
    url: "https://www.netflix.com/",
    searchUrl: "https://www.netflix.com/search?q=",
  },
  "Paramount+ Amazon Channel": {
    name: "Paramount+ Amazon Channel",
    url: "",
    searchUrl: "https://www.amazon.co.uk/s?i=instant-video&rh=p_n_ways_to_watch%3A7448663031&k=",
  },
  "Rakuten TV": {
    name: "Rakuten TV",
    url: "https://rakuten.tv/",
    searchUrl: "https://rakuten.tv/nl/search?q=",
  },
  YouTube: {
    name: "YouTube",
    url: "https://www.youtube.com",
    searchUrl: "https://www.youtube.com/results?search_query=",
  },
};

interface ConvertProviderToUrlProps {
  provider: string;
  name: string;
}

const convertProviderToUrl = ({ provider, name }: ConvertProviderToUrlProps) => {
  if (providers[provider as keyof Providers]) {
    return providers[provider as keyof Providers].searchUrl + name;
  } else {
    return "#";
  }
};

const JustWatch = ({ justWatch, themeColor, name }: JustWatchProps) => {
  const session = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const currentLocation =
    justWatch.results[(session.data?.user?.profile?.region.toUpperCase() as keyof IJustWatchProps) ?? "GB"];
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <div>
      <motion.button
        style={{
          background: themeColor.hex,
        }}
        className={`
          flex items-center justify-between w-full px-3 py-2 mt-2 rounded-md 
          ${themeColor.isDark && "text-white"}
          ${themeColor.isLight && "text-primaryBackground"}
        `}
        onClick={() => (modalOpen ? close() : open())}
      >
        <span className="font-bold">Available on</span>
        <BiCameraMovie className="text-2xl" />
      </motion.button>

      <AnimatePresence initial={false} mode="wait">
        {modalOpen && (
          <Modal handleClose={close}>
            {currentLocation ? (
              <div className="pt-2 text-left">
                {"flatrate" in currentLocation && (
                  <div className="pt-4">
                    <p className="pb-2 font-bold">Streaming</p>
                    <HorizontalScrollContainer>
                      {currentLocation.flatrate.map((item) => (
                        <Link
                          href={convertProviderToUrl({
                            provider: item.provider_name,
                            name: name,
                          })}
                          key={item.provider_name}
                          className="flex-shrink-0"
                        >
                          <a target="_blank">
                            <Image
                              className="rounded-md"
                              alt={item.provider_name}
                              src={`https://image.tmdb.org/t/p/original${item.logo_path}`}
                              width={56}
                              height={56}
                            />
                          </a>
                        </Link>
                      ))}
                    </HorizontalScrollContainer>
                  </div>
                )}

                {"rent" in currentLocation && (
                  <div className="pt-4">
                    <p className="pb-2 font-bold">Rent</p>
                    <HorizontalScrollContainer>
                      {currentLocation.rent.map((item) => (
                        <Link
                          href={convertProviderToUrl({
                            provider: item.provider_name,
                            name: name,
                          })}
                          key={item.provider_name}
                          className="flex-shrink-0"
                        >
                          <a target="_blank">
                            <Image
                              className="rounded-md"
                              alt={item.provider_name}
                              src={`https://image.tmdb.org/t/p/original${item.logo_path}`}
                              width={56}
                              height={56}
                            />
                          </a>
                        </Link>
                      ))}
                    </HorizontalScrollContainer>
                  </div>
                )}

                {"buy" in currentLocation && (
                  <div className="pt-4">
                    <p className="pb-2 font-bold">Purchase</p>
                    <HorizontalScrollContainer>
                      {currentLocation.buy.map((item) => (
                        <Link
                          href={convertProviderToUrl({
                            provider: item.provider_name,
                            name: name,
                          })}
                          key={item.provider_name}
                          className="flex-shrink-0"
                        >
                          <a target="_blank">
                            <Image
                              className="rounded-md"
                              alt={item.provider_name}
                              src={`https://image.tmdb.org/t/p/original${item.logo_path}`}
                              width={56}
                              height={56}
                            />
                          </a>
                        </Link>
                      ))}
                    </HorizontalScrollContainer>
                  </div>
                )}
                <p className="pb-2 text-sm italic text-right opacity-25">
                  Powered by{" "}
                  <Link href="https://www.justwatch.com/" target="_blank">
                    <a>JustWatch</a>
                  </Link>
                </p>
              </div>
            ) : (
              <p className="py-4 text-white">This is not currently available on any known services in your location.</p>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

interface JustWatchProps {
  justWatch: {
    results: IJustWatchProps;
  };
  themeColor: IThemeColor;
  name: string;
}

interface IProviderType {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface IProviders {
  link: string;
  free: IProviderType[];
  flatrate: IProviderType[];
  rent: IProviderType[];
  buy: IProviderType[];
}

export interface IJustWatchProps {
  AE: IProviders;
  AR: IProviders;
  AT: IProviders;
  AU: IProviders;
  BA: IProviders;
  BB: IProviders;
  BE: IProviders;
  BG: IProviders;
  BO: IProviders;
  BR: IProviders;
  BS: IProviders;
  CA: IProviders;
  CH: IProviders;
  CI: IProviders;
  CL: IProviders;
  CO: IProviders;
  CR: IProviders;
  CZ: IProviders;
  DE: IProviders;
  DK: IProviders;
  DO: IProviders;
  DZ: IProviders;
  EC: IProviders;
  EG: IProviders;
  ES: IProviders;
  FI: IProviders;
  FR: IProviders;
  GB: IProviders;
  GF: IProviders;
  GH: IProviders;
  GQ: IProviders;
  GT: IProviders;
  HK: IProviders;
  HN: IProviders;
  HR: IProviders;
  HU: IProviders;
  ID: IProviders;
  IE: IProviders;
  IL: IProviders;
  IN: IProviders;
  IQ: IProviders;
  IT: IProviders;
  JM: IProviders;
  JP: IProviders;
  KE: IProviders;
  KR: IProviders;
  LB: IProviders;
  LY: IProviders;
  MD: IProviders;
  MU: IProviders;
  MX: IProviders;
  MY: IProviders;
  MZ: IProviders;
  NE: IProviders;
  NG: IProviders;
  NL: IProviders;
  NO: IProviders;
  NZ: IProviders;
  PA: IProviders;
  PE: IProviders;
  PH: IProviders;
  PL: IProviders;
  PS: IProviders;
  PT: IProviders;
  PY: IProviders;
  RO: IProviders;
  RU: IProviders;
  SA: IProviders;
  SC: IProviders;
  SE: IProviders;
  SG: IProviders;
  SI: IProviders;
  SK: IProviders;
  SN: IProviders;
  SV: IProviders;
  TH: IProviders;
  TT: IProviders;
  TW: IProviders;
  TZ: IProviders;
  UG: IProviders;
  US: IProviders;
  UY: IProviders;
  VE: IProviders;
  ZM: IProviders;
}

export default JustWatch;
