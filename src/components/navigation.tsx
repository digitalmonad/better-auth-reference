"use client";
import { authClient } from "@/auth/auth-client";
import Link from "next/link";

export const Navigation = () => {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  return (
    <nav className="flex space-x-2">
      {session && (
        <>
          <Link href={"/"}>/home</Link>
          {user?.role === "admin" && <Link href={"/admin"}>/admin</Link>}
        </>
      )}
    </nav>
  );
};
