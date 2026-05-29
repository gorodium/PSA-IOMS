export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background/50 backdrop-blur-sm z-50 fixed inset-0">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
        <div className="absolute inset-0 rounded-2xl ring-4 ring-primary/20 animate-ping"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Loading..."
          className="h-full w-full object-contain animate-pulse"
        />
      </div>
    </div>
  );
}
