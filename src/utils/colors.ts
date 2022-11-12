import { getAverageColor } from "fast-average-color-node";
import { BackdropImage, PosterImage } from "./generateImages";

interface IConvertImageToPrimaryColor {
  image: any;
  fallback: string | undefined;
}

const convertImageToPrimaryColor = async ({ image, fallback }: IConvertImageToPrimaryColor) => {
  if (image) return getAverageColor(PosterImage({ path: image, size: "sm" }));
  if (fallback) return getAverageColor(BackdropImage({ path: fallback, size: "sm" }));

  return {
    hex: "#FAC42C",
    isDark: false,
    isLight: true,
  };
};

export default convertImageToPrimaryColor;
