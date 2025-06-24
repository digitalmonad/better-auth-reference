import { SignUpForm } from "@/components/auth/sign-up/sign-up-form";

export default function Page() {
  return (
    <div className="flex flex-1 w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
