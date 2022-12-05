import { BackdropImage } from "../../utils/generateImages";

const ContentBackdrop = ({ path }: { path?: string }) => {
  return (
    <div
      className="absolute w-screen max-w-full h-64 md:h-[32rem] top-0 left-0"
      style={{
        background: path && `url("${BackdropImage({ path: path, size: "lg" })}") no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <div className="relative w-full h-full bg-gradient-to-t from-primaryBackground" />
    </div>
  );
};

export default ContentBackdrop;
