import loading from "@/assets/brand/loading.svg";
import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen">
      <Image src={loading} alt="loading" className="w-1/4" />
    </main>
  );
}
