const BASE_URL = "https://image.tmdb.org/t/p/";

interface IBackdropImage {
  path: string;
  size?: "sm" | "md" | "lg";
}

export const BackdropImage = ({ path, size }: IBackdropImage): string => {
  if (path === undefined || path === null || path === "null") return "/noimage.png";

  switch (size) {
    case "sm":
      return `${BASE_URL}w300${path}`;
    case "md":
      return `${BASE_URL}w780${path}`;
    case "lg":
      return `${BASE_URL}w1280${path}`;
    default:
      return `${BASE_URL}original${path}`;
  }
};

interface IPosterImage {
  path: string;
  size?: "sm" | "md" | "lg";
}

export const PosterImage = ({ path, size }: IPosterImage): string => {
  if (path === undefined || path === null || path === "null") return "/noimage.png";

  switch (size) {
    case "sm":
      return `${BASE_URL}w342${path}`;
    case "md":
      return `${BASE_URL}w500${path}`;
    case "lg":
      return `${BASE_URL}w780${path}`;
    default:
      return `${BASE_URL}original${path}`;
  }
};

interface IPersonImage {
  path: string;
  size?: "sm" | "md";
}

export const PersonImage = ({ path, size }: IPersonImage): string => {
  if (path === undefined || path === null || path === "null") return "/noimage.png";

  switch (size) {
    case "sm":
      return `${BASE_URL}w185${path}`;
    case "md":
      return `${BASE_URL}h632${path}`;
    default:
      return `${BASE_URL}original${path}`;
  }
};
