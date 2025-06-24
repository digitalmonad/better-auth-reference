"use client";

import Link from "next/link";
import SignoutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const isPending = false;
  const session = false;
  if (isPending) return <div>Loading...</div>;

  return !session ? (
    <div className="flex gap-2 justify-center">
      <Link href="/sign-in">
        <Button>Sign In</Button>
      </Link>
      <Link href="/sign-up">
        <Button>Sign Up</Button>
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <SignoutButton />
    </div>
  );
}
