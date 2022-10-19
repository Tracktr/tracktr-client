// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { movieRouter } from "./movie";
import { authRouter } from "./auth";
import { personRouter } from "./person";

export const appRouter = router({
  movie: movieRouter,
  person: personRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
