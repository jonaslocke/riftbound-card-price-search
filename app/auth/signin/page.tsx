"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import logo from "@/assets/brand/hextech-codex-gradient.svg";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <div className="min-h-screen w-full bg-[#0a0f1c] text-white">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden md:block">
          <Image
            src="/pouty-poro.webp"
            alt="Pouty Poro"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.2),rgba(2,6,23,0.85)_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,16,0.95)_0%,rgba(5,8,16,0.75)_15%,rgba(5,8,16,0.12)_60%,rgba(5,8,16,0)_100%)]" />
          <div className="absolute left-10 top-10 flex flex-col gap-4">
            <Image src={logo} alt="Hextech Codex" className="h-10 w-auto" />
          </div>
          <div className="absolute bottom-10 left-10 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-xs text-white/70 backdrop-blur">
            Prices update daily. Keep your session active to see listings.
          </div>
        </div>
        <div className="relative flex items-center justify-center px-6 py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),rgba(2,6,23,0.95)_55%)]" />
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-orange-500 to-rose-500" />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            <div className="mb-8">
              <h2 className="text-3xl font-(--font-display)">Welcome back</h2>
              <p className="mt-2 text-sm text-white/70">
                Sign in to unlock card price listings.
              </p>
            </div>
            <Button
              type="button"
              className="w-full gap-2 bg-white text-slate-900 hover:bg-white/90"
              onClick={() => signIn("google", { callbackUrl })}
            >
              Continue with Google
            </Button>
            <div className="mt-6 text-xs text-white/50">
              By signing in you agree to the{" "}
              <Link
                href="https://www.riotgames.com/en/legal"
                className="underline"
              >
                Riot Games legal policies
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
