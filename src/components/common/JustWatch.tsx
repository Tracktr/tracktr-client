import { BiCameraMovie } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import HorizontalScrollContainer from "./HorizontalScrollContainer";
import Image from "next/image";
import ReactDOM from "react-dom";
import Link from "next/link";
import { IThemeColor } from "../watchButton/BaseWatchButton";

interface IProvider {
  name: string;
  url: string;
  searchUrl: string;
}

interface Provider {
  Netflix: IProvider;
  "Amazon Video": IProvider;
  "Apple iTunes": IProvider;
  "Microsoft Store": IProvider;
  "Rakuten TV": IProvider;
}

export const providers: Provider = {
  Netflix: {
    name: "Netflix",
    url: "https://www.netflix.com/",
    searchUrl: "https://www.netflix.com/search?q=",
  },
  "Amazon Video": {
    name: "Amazon Video",
    url: "https://www.primevideo.com/",
    searchUrl: "https://www.primevideo.com/search/?phrase=",
  },
  "Apple iTunes": {
    name: "Apple iTunes",
    url: "https://tv.apple.com/",
    searchUrl: "https://tv.apple.com/search?term=",
  },
  "Microsoft Store": {
    name: "Microsoft Store",
    url: "https://www.microsoft.com/store/movies-and-tv",
    searchUrl: "https://www.microsoft.com/search/explore?q=",
  },
  "Rakuten TV": {
    name: "Rakuten TV",
    url: "https://rakuten.tv/",
    searchUrl: "https://rakuten.tv/nl/search?q=",
  },
};

interface ConvertProviderToUrlProps {
  provider: string;
  name: string;
}

const convertProviderToUrl = ({ provider, name }: ConvertProviderToUrlProps) => {
  if (providers[provider as keyof Provider]) {
    return providers[provider as keyof Provider].searchUrl + name;
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
        {modalOpen && <Modal handleClose={close} data={currentLocation} name={name} />}
      </AnimatePresence>
    </div>
  );
};
const Backdrop = ({ children, onClick }: { children: JSX.Element | JSX.Element[]; onClick: () => void }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-opacity-75 bg-primaryBackground"
    >
      {children}
    </motion.div>
  );
};

const Modal = ({ handleClose, data, name }: { handleClose: () => void; data: IProviders; name: string }) => {
  return ReactDOM.createPortal(
    <Backdrop onClick={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-auto max-w-xl px-4 text-white bg-black rounded-md shadow-xl"
      >
        {data ? (
          <div className="pt-2 text-left">
            {"flatrate" in data && (
              <div className="pt-4">
                <p className="pb-2 font-bold">Streaming</p>
                <HorizontalScrollContainer>
                  {data.flatrate.map((item) => (
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

            {"rent" in data && (
              <div className="pt-4">
                <p className="pb-2 font-bold">Rent</p>
                <HorizontalScrollContainer>
                  {data.rent.map((item) => (
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

            {"buy" in data && (
              <div className="pt-4">
                <p className="pb-2 font-bold">Purchase</p>
                <HorizontalScrollContainer>
                  {data.buy.map((item) => (
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
      </div>
    </Backdrop>,
    document.body
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
