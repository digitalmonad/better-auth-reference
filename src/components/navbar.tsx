import Link from "next/link";
import AuthButtons from "@/components/auth-buttons";
import { Navigation } from "./navigation";

export default async function Navbar() {
  return (
    <nav className="flex justify-between items-center py-2 px-4 bg-accent min-h-[50px]">
      <span className="flex items-baseline space-x-4">
        <Link href="/" className="text-xl font-bold">
          better-auth
        </Link>
        <Navigation />
      </span>
      <AuthButtons />
    </nav>
  );
}
