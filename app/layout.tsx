import { getLanguageTag } from "@/lib/getLanguageTag";
import { createHextechMetadata } from "@/lib/metadata/create-hextech-metadata";
import type { Metadata } from "next";
import type { CSSProperties, PropsWithChildren } from "react";
import "./globals.css";
import arrowSmall from "@/assets/arrow-small.svg";
import arrowMedium from "@/assets/arrow-medium.svg";
import arrowLarge from "@/assets/arrow-large.svg";
import Image from "next/image";

export const viewport = {
  themeColor: "#0A0F1C",
};

export async function generateMetadata(): Promise<Metadata> {
  return createHextechMetadata();
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const languageTag = await getLanguageTag();

  return (
    <html lang={languageTag}>
      <body
        style={
          {
            "--background-image": "url('/assets/backgrounds/bg1.webp')",
          } as CSSProperties
        }
      >
        <div className="top-[calc(calc(100%-439px)/2)] absolute flex sm:*:-ml-39">
          <Image className="opacity-10" src={arrowSmall} alt="arrow-small" />
          <Image className="opacity-20" src={arrowMedium} alt="arrow-small" />
          <Image className="opacity-30" src={arrowLarge} alt="arrow-small" />
        </div>
        {children}
      </body>
    </html>
  );
}
