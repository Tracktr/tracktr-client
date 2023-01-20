// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { movieRouter } from "./movie";
import { authRouter } from "./auth";
import { personRouter } from "./person";
import { tvRouter } from "./tv";
import { seasonRouter } from "./season";
import { episodeRouter } from "./episode";
import { commonRouter } from "./common";
import { profileRouter } from "./profile";
import { watchlistRouter } from "./watchlist";
import { searchRouter } from "./search";
import { reviewRouter } from "./review";
import { importRouter } from "./import";
import { followersRouter } from "./followers";
import { dashboardRouter } from "./dashboard";
import { calendarRouter } from "./calendar";
import { feedbackRouter } from "./feedback";

export const appRouter = router({
  movie: movieRouter,
  person: personRouter,
  tv: tvRouter,
  season: seasonRouter,
  episode: episodeRouter,
  auth: authRouter,
  common: commonRouter,
  profile: profileRouter,
  watchlist: watchlistRouter,
  search: searchRouter,
  review: reviewRouter,
  import: importRouter,
  followers: followersRouter,
  dashboard: dashboardRouter,
  calendar: calendarRouter,
  feedback: feedbackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
