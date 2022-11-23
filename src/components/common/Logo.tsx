import Link from "next/link";

interface ILogo {
  textColor: "text-white" | "text-primaryBackground";
  dotColor: string;
  signedIn: boolean;
}

const Logo = ({ textColor, dotColor, signedIn }: ILogo) => (
  <Link href={signedIn ? "/dashboard" : "/"}>
    <a className="col-span-1">
      <h1 className={`text-3xl font-black select-none ${textColor}`}>
        TRACKTR
        <span className={dotColor}>.</span>
      </h1>
    </a>
  </Link>
);

export default Logo;
