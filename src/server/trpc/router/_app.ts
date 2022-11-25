// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { movieRouter } from "./movie";
import { authRouter } from "./auth";
import { personRouter } from "./person";
import { tvRouter } from "./tv";
import { seasonRouter } from "./season";
import { episodeRouter } from "./episode";
import { commonRouter } from "./common";
import { multiRouter } from "./multi";
import { profileRouter } from "./profile";
import { watchlistRouter } from "./watchlist";

export const appRouter = router({
  movie: movieRouter,
  person: personRouter,
  tv: tvRouter,
  season: seasonRouter,
  episode: episodeRouter,
  auth: authRouter,
  common: commonRouter,
  multi: multiRouter,
  profile: profileRouter,
  watchlist: watchlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
