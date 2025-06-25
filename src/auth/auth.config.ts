import { sendEmail } from "@/actions/email";
import prisma from "@/lib/prisma";
import { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { admin } from "better-auth/plugins";

export const authConfig = {
  plugins: [openAPI(), admin()],
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      premium: {
        type: "boolean",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (updates every 1 day)
    cookieCache: {
      // get the session from cookie not from the database each time when checking the session
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    enabled: true, // enable in development mode
    window: 60, // time window in seconds
    max: 100,
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 3,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: <a href=${url}>LINK</a>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.BASE_URL}/email-verified`;

      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click he link to verify your email: ${verificationUrl}`,
      });
    },
  },
} satisfies BetterAuthOptions;
