import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import { Recursive } from "next/font/google";
import { cn } from "@/lib/utils";

const recursive = Recursive({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={cn(
        "flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
        recursive.className
      )}
    >
      <div className="space-y-6 text-center text-white">
        <h1 className="text-5xl font-bold">⭐ Auth</h1>
        <p className="text-2xl">A simple Authentication Service</p>
        <Link className={buttonVariants({ variant: "secondary" })} href="/auth/login">
          Sign in
        </Link>
      </div>
    </main>
  );
}
