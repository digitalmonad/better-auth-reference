import { betterAuth, BetterAuthOptions } from "better-auth";

import { authConfig } from "./auth.config";

export const authServer = betterAuth(authConfig);
