"use client";

import Image from "next/image";
import Link from "next/link";
import { useCardDetails } from "./context";

export default function OtherPrintings() {
  const { otherPrintings } = useCardDetails();

  if (otherPrintings.length < 1) {
    return null;
  }

  console.log({ otherPrintings });

  return (
    <div className="flex gap-2 mt-6 text-white">
      {otherPrintings.map((priting) => (
        <Link
          href="#"
          className="relative flex flex-col items-center gap-1 bg-white py-0.5 rounded w-[62]"
          key={priting.riftbound_id}
        >
          {priting.media?.image_url && (
            <Image
              src={priting.media?.image_url}
              alt={`${priting.name} art`}
              width={58}
              height={0}
              className="aspect-63/88"
            />
          )}
          <div className="bottom-0 absolute flex justify-center items-end bg-linear-to-t from-55% from-white to-white/20 w-full h-6 text-black/80 uppercase tiny-font">
            <span className="pb-1">{priting.public_code}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
