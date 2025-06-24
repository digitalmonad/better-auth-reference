import { authClient } from "@/auth/auth-client";
import { signInSchema } from "@/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorContext } from "better-auth/react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const useSignInForm = () => {
  const router = useRouter();

  const [pendingCredentials, setPendingCredentials] = useState(false);
  const [pendingGithub, setPendingGithub] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>
  ) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPendingCredentials(true);
        },
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          console.log(ctx);
          toast.warning(ctx.error.message ?? "Something went wrong.");
        },
      }
    );
    setPendingCredentials(false);
  };

  const handleSignInWithGithub = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setPendingGithub(true);
        },

        onError: (ctx: ErrorContext) => {
          toast.warning(ctx.error.message ?? "Something went wrong.");
        },
      }
    );
    setPendingGithub(false);
  };

  return {
    handleCredentialsSignIn,
    handleSignInWithGithub,
    form,
    pendingCredentials,
    pendingGithub,
  };
};
