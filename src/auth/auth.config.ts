import { sendEmail } from "@/actions/email";
import prisma from "@/lib/prisma";
import { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

export const authConfig = {
  plugins: [openAPI()],
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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
