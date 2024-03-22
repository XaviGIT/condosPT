import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { useSession } from "next-auth/react";

const { data: sessionData } = useSession();

export const userRouter = createTRPCRouter({
    hello: protectedProcedure      
      .query(() => {
        return {
          greeting: `Hello ${sessionData?.user.name}`,
        };
      }),
});