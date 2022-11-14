import { getAverageColor } from "fast-average-color-node";
import { BackdropImage, PosterImage } from "./generateImages";

interface IConvertImageToPrimaryColor {
  image: any;
  fallback: string | undefined;
}

const convertImageToPrimaryColor = async ({ image, fallback }: IConvertImageToPrimaryColor) => {
  const poster = PosterImage({ path: image, size: "sm" });
  const backdrop = BackdropImage({ path: fallback ? fallback : "null", size: "sm" });

  if (poster !== "/noimage.png") {
    return getAverageColor(poster, {
      algorithm: "dominant",
      ignoredColor: [0, 0, 0, 255, 50],
    });
  } else if (backdrop !== "/noimage.png") {
    return getAverageColor(backdrop, {
      algorithm: "dominant",
      ignoredColor: [0, 0, 0, 255, 50],
    });
  } else {
    return {
      hex: "#FAC42C",
      isDark: false,
      isLight: true,
    };
  }
};

export default convertImageToPrimaryColor;
