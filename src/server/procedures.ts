import { j } from "./__internals/j"
import { authMiddleware } from "./auth-middleware"

export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = publicProcedure.use(authMiddleware)
