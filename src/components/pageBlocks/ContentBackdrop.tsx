import { BackdropImage } from "../../utils/generateImages";

const ContentBackdrop = ({ path }: { path?: string }) => {
  return (
    <div
      className="absolute w-screen max-w-full h-64 md:h-[32rem] top-0 left-0"
      style={{
        backgroundImage: path && `url("${BackdropImage({ path: path, size: "lg" })}")`,
        backgroundRepeat: "no-repeat1",
        backgroundSize: "cover",
      }}
    >
      <div className="relative w-full h-full bg-gradient-to-t from-primaryBackground" />
    </div>
  );
};

export default ContentBackdrop;
