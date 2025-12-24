import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import GlobalHeader from "./components/GlobalHeader";

export const metadata: Metadata = {
  title: "Rift Search",
  description: "Minimal Next.js Hello World",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
