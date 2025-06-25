"use client";
import Link from "next/link";
import SignoutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/auth/auth-client";

export default function AuthButtons() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;

  return !session ? (
    <div className="flex gap-2 justify-center">
      <Link href="/sign-in">
        <Button size={"sm"}>Sign In</Button>
      </Link>
      <Link href="/sign-up">
        <Button size={"sm"}>Sign Up</Button>
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <SignoutButton />
    </div>
  );
}
