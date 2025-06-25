"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { resetPasswordSchema } from "@/auth/auth.schema";

import { authClient } from "@/auth/auth-client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useResetPassword = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsPending(true);
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      return;
    }
    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });
    if (error) {
      toast.warning(error.message);
    } else {
      toast.success("Password reset successful. Login to continue.");
      router.push("/sign-in");
    }
    setIsPending(false);
  };

  return { error, isPending, form, onSubmit };
};
