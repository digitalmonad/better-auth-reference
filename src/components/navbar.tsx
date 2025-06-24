import Link from "next/link";
import AuthButtons from "@/components/auth-buttons";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-3 px-4 bg-accent">
      <Link href="/" className="text-xl font-bold">
        better-auth
      </Link>
      <AuthButtons />
    </nav>
  );
}
