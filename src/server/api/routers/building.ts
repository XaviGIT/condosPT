import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const buildingRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ctx}) => {
      return ctx.db.query.buildings.findMany({
        orderBy: (buildings, { asc }) => [asc(buildings.name)]
      })
    }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),
});
