import { SignUpForm } from "@/components/auth/sign-up/sign-up-form";
import { PropsWithChildren } from "react";

export default function AuthFormsLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-1 w-full items-center justify-center">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
