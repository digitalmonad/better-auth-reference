import { authServer } from "@/auth/auth-server";
import { headers } from "next/headers";

export default async function Home() {
  const auth = await authServer.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="flex flex-1 items-center justify-center">
      {auth?.user.email}
    </div>
  );
}
