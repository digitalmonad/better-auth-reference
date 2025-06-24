import { signUpSchema } from "@/auth/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/auth/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export const useSignUpForm = () => {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast(
            "Your account has been created. Check your email for a verification link."
          );
        },
        onError: (ctx) => {
          console.log("error", ctx);
          toast(ctx.error.message ?? "Something went wrong.");
        },
      }
    );
    setPending(false);
  };

  return { pending, form, onSubmit };
};
