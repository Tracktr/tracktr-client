import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import convertImageToPrimaryColor from "../../../utils/colors";

export const personRouter = router({
  personById: publicProcedure
    .input(
      z.object({
        slug: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`person/${input?.slug}`, process.env.NEXT_PUBLIC_TMDB_API);
      url.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
      url.searchParams.append("append_to_response", "movie_credits,tv_credits");
      if (ctx) url.searchParams.append("language", ctx.session?.user?.profile.language as string);

      const res = await fetch(url);
      const json = await res.json();

      const color = await convertImageToPrimaryColor({ image: json.profile_path });

      return {
        ...json,
        theme_color: color,
      };
    }),
});
