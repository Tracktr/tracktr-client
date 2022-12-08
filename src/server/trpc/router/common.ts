import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

export const commonRouter = router({
  languages: publicProcedure.query(async () => {
    const url = new URL(`configuration/languages`, process.env.NEXT_PUBLIC_TMDB_API);
    url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

    const res = await fetch(url);
    const json = await res.json();

    if (json?.status_code) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: json.status_message,
        cause: json.status_code,
      });
    }

    return {
      ...json,
    };
  }),
  watchProviderRegions: publicProcedure.query(async () => {
    const url = new URL(`watch/providers/regions`, process.env.NEXT_PUBLIC_TMDB_API);
    url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

    const res = await fetch(url);
    const json = await res.json();

    if (json?.status_code) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: json.status_message,
        cause: json.status_code,
      });
    }

    return {
      ...json,
    };
  }),
});
