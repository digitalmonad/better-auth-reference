"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";

import Link from "next/link";

import { signInSchema, signUpSchema } from "@/auth/auth.schema";
import { z } from "zod";

import { useSignInForm } from "./use-sign-in-form";
import { cn } from "@/lib/utils";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, handleCredentialsSignIn, pendingCredentials } = useSignInForm();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Sign In
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCredentialsSignIn)}
            className="space-y-6"
          >
            {["email", "password"].map((field) => (
              <FormField
                control={form.control}
                key={field}
                name={field as keyof z.infer<typeof signInSchema>}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field === "password" ? "password" : "email"}
                        placeholder={`Enter your ${field}`}
                        {...fieldProps}
                        autoComplete={
                          field === "password" ? "current-password" : "email"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <LoadingButton pending={pendingCredentials}>Sign in</LoadingButton>
          </form>
        </Form>
        {/* <div className="mt-4">
            <LoadingButton
              pending={pendingGithub}
              onClick={handleSignInWithGithub}
            >
              <GithubIcon className="w-4 h-4 mr-2" />
              Continue with GitHub
            </LoadingButton>
          </div> */}
        <div className="mt-4 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
