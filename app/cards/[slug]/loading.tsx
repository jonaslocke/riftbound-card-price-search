export default function Loading() {
  return (
    <main className="flex flex-col w-full max-w-2xl">
      <div className="mt-6 space-y-4 animate-pulse">
        <div className="h-20 rounded-md bg-black/10" />
        <div className="h-72 rounded-md bg-black/10" />
        <div className="h-80 rounded-md bg-black/10" />
      </div>
    </main>
  );
}
