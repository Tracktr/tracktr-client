// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { movieRouter } from "./movie";
import { authRouter } from "./auth";
import { personRouter } from "./person";
import { tvRouter } from "./tv";
import { seasonRouter } from "./season";
import { episodeRouter } from "./episode";

export const appRouter = router({
  movie: movieRouter,
  person: personRouter,
  tv: tvRouter,
  season: seasonRouter,
  episode: episodeRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
