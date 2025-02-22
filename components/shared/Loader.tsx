import { Loader } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
      {/* Background gradient and grid overlay to match the landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[url(/grid.svg)] opacity-[0.02] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative flex flex-col items-center gap-6 p-4">
        {/* Loading animation */}
        <div className="relative">
          <div className="size-24 rounded-full border-8 border-zinc-800 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-0 size-24 rounded-full border-t-8 border-teal-400 animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute inset-0 grid place-items-center">
            <Loader className="size-8 animate-pulse text-teal-400" />
          </div>
        </div>

        {/* Loading text with animation */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500 animate-pulse">
            Loading HUBBER
          </h1>
          <p className="text-sm text-zinc-400 animate-pulse">
            Please wait while we prepare your content.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-teal-400 animate-[progressBar_2s_ease-in-out_infinite]" />
        </div>

        {/* Screen reader accessibility text */}
        <span className="sr-only">Loading content, please wait...</span>
      </div>
    </div>
  );
}
