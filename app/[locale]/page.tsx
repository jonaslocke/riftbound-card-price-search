"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import logo from "@/assets/brand/hextech-index-gradient.svg";
import hammer from "@/assets/brand/hextech-index-hammer-gradient.svg";
import { Button } from "@/components/ui/button";
import { readLastKnownPath } from "@/lib/lastKnownPath";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchFormWithAnalytics from "../components/analytics/SearchFormWithAnalytics";
import { SignInSignOut } from "../components/SignInSignOut";
import { getLocaleFromPathname } from "../i18n/pathname";
import { defaultLocale } from "../i18n/settings";

import arrowSmall from "@/assets/arrow-small.svg";
import arrowMedium from "@/assets/arrow-medium.svg";
import arrowLarge from "@/assets/arrow-large.svg";

import poster from "@/assets/hero-poster.jpg";
import { Navigation } from "@/features/main-header/components/navigation";

export default function Home() {
  const { t } = useI18nHelpers();
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const isAuthenticated = status === "authenticated";

  const signInCallbackUrl = pathname || `/${locale}`;
  const getCallbackUrl = () =>
    readLastKnownPath(signInCallbackUrl) ?? signInCallbackUrl;
  const handleSignIn = () => {
    signIn("google", { callbackUrl: getCallbackUrl() });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: getCallbackUrl() });
  };
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-screen h-screen object-cover"
        poster={poster.src}
      >
        <source src="/gears.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-t from-background to-black/40 backdrop-blur-lg" />

      <div className="z-10 relative flex flex-col min-h-screen">
        <header className="flex justify-between items-center bg-white/10 backdrop-blur-lg border-white/30 border-b h-[72]">
          <Image src={hammer} alt={t("brand.name")} height={40} />
          <nav className="">
            <Navigation />
          </nav>
          <SignInSignOut
            isAuthenticated={isAuthenticated}
            displayName={session?.user?.name ?? ""}
            displayEmail={session?.user?.email ?? ""}
            imageUrl={session?.user?.image ?? ""}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            className="cursor-pointer"
            options={{
              avatar: {
                className: "size-10",
              },
            }}
          />
        </header>

        <main className="flex flex-col justify-center">
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex gap-6">
              <Image src={hammer} alt={t("brand.name")} />
              <Image
                src={logo}
                alt={t("brand.name")}
                height={100}
                width={436}
              />
            </div>
            <p className="text-white/80 text-xl sm:text-2xl text-balance">
              {t("home.hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-semibold text-white text-base transition">
                {t("home.cta.browse_prices")}
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-lg px-8 py-4 rounded-lg font-semibold text-white text-base transition">
                {t("home.cta.view_gallery")}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// export default function Home() {
//   const { t } = useI18nHelpers();
//   const pathname = usePathname();
//   const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
//   const { data: session, status } = useSession();
//   const isAuthenticated = status === "authenticated";
//   const [theme, setTheme] = useState<"light" | "dark">("dark");

//   useEffect(() => {
//     const stored =
//       typeof window !== "undefined"
//         ? window.localStorage.getItem("rift-theme")
//         : null;
//     if (stored === "light" || stored === "dark") {
//       setTheme(stored);
//       document.documentElement.setAttribute("data-theme", stored);
//       return;
//     }

//     const prefersDark =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const initial = prefersDark ? "dark" : "light";
//     setTheme(initial);
//     document.documentElement.setAttribute("data-theme", initial);
//   }, []);

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem("rift-theme", theme);
//     }
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   };

//   const signInCallbackUrl = pathname || `/${locale}`;
//   const getCallbackUrl = () =>
//     readLastKnownPath(signInCallbackUrl) ?? signInCallbackUrl;
//   const handleSignIn = () => {
//     signIn("google", { callbackUrl: getCallbackUrl() });
//   };

//   const handleSignOut = () => {
//     signOut({ callbackUrl: getCallbackUrl() });
//   };

//   return (
//     <main className="flex flex-col gap-6 mx-auto w-full max-w-2xl min-h-screen container-padding">
//       {isAuthenticated && (
//         <SignInSignOut
//           displayName={session?.user?.name ?? ""}
//           displayEmail={session?.user?.email ?? ""}
//           imageUrl={session?.user?.image ?? ""}
//           onSignOut={handleSignOut}
//           onSignIn={handleSignIn}
//           isAuthenticated={isAuthenticated}
//           className="top-[clamp(16px,4vw,32px)] right-[clamp(16px,4vw,32px)] fixed cursor-pointer"
//           options={{
//             avatar: {
//               className: "size-10",
//             },
//           }}
//         />
//       )}
//       <Button
//         variant="outline"
//         size="icon-sm"
//         onClick={toggleTheme}
//         aria-label={
//           theme === "dark"
//             ? t("theme.switch_to_light")
//             : t("theme.switch_to_dark")
//         }
//         className="right-[clamp(16px,4vw,32px)] bottom-[clamp(16px,4vw,32px)] fixed"
//       >
//         {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//       </Button>

//       <h1 className="sr-only">{t("brand.name")}</h1>
//       <div className={cn("flex justify-center pt-6")}>
//         <Image
//           src={logo}
//           alt={t("brand.name")}
//           className="w-80 sm:w-96"
//           loading="eager"
//         />
//       </div>
//       <p className="text-accent text-sm text-center leading-relaxed">
//         {t("home.tagline")}
//       </p>

//       <SearchFormWithAnalytics
//         placeholder={t("search.placeholder")}
//         mobilePlaceholder={t("search.placeholder_mobile")}
//       />
//     </main>
//   );
// }
