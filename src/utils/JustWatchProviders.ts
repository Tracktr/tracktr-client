export const providers: any = {
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
};

interface ConvertProviderToUrlProps {
  provider: string;
  name: string;
}

export const convertProviderToUrl = ({ provider, name }: ConvertProviderToUrlProps) => {
  if (providers[provider]) {
    return providers[provider].searchUrl + name;
  } else {
    return "#";
  }
};
