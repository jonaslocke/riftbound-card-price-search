import loading from "@/assets/brand/loading.svg";
import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex flex-col w-screen h-screen items-center justify-center">
      <Image src={loading} alt="loading" className="w-1/3" />
    </main>
  );
}
