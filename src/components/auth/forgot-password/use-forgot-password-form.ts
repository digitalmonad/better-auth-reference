import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/auth/auth-client";

import { forgotPasswordSchema } from "@/auth/auth.schema";
import { toast } from "sonner";

export const useForgotPasswordForm = () => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsPending(true);
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.warning(error.message);
    } else {
      toast.success(
        "If an account exists with this email, you will receive a password reset link."
      );
    }
    setIsPending(false);
  };

  return {
    isPending,
    form,
    onSubmit,
  };
};
