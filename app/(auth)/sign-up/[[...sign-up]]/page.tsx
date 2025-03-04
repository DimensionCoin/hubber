import { Button } from "@/components/ui/button";
import { SignUp } from "@clerk/nextjs";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="fixed inset-0 bg-[url(/grid.svg)] opacity-[0.02] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Header */}
      <header className="relative w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 group w-fit px-3 py-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors"
          >
            <Building2 className="w-8 h-8 text-teal-500 group-hover:text-teal-400 transition-colors" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
              HUBBER
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-md mx-auto space-y-6 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              Create your account
            </h1>
            <p className="text-zinc-400">
              Get started with HUBBER and experience the future of business
              management.
            </p>
          </div>

          {/* Clerk SignUp wrapped in a styled container */}
          <div className="max-w-[400px] mx-auto relative">
            <div className="absolute -inset-x-8 -inset-y-6 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-xl" />
            <div className="relative bg-zinc-900/50 backdrop-blur-xl rounded-lg border border-zinc-800/50 p-6 items-center justify-center flex">
              <SignUp
                afterSignOutUrl="/"
                appearance={{
                  variables: {
                    colorPrimary: "#14b8a6", // teal-500
                    colorBackground: "transparent",
                    colorText: "#fafafa",
                    colorInputText: "#fafafa",
                    colorInputBackground: "#18181b",

                    fontFamily: "inherit",
                  },
                  elements: {
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-zinc-100",
                    headerSubtitle: "text-zinc-400",
                    socialButtonsBlockButton:
                      "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors",
                    socialButtonsBlockButtonText: "text-zinc-300",
                    formButtonPrimary:
                      "bg-primary hover:bg-primary/90 transition-colors",
                    formFieldInput: "bg-zinc-800/50 border-zinc-700",
                    formFieldLabel: "text-zinc-400",
                    footer: "hidden",
                    footerAction: "text-zinc-400",
                    footerActionLink: "text-primary hover:text-primary/90",
                  },
                }}
              />
            </div>
          </div>

          {/* ✅ Corrected Sign-Up Section */}
          <div className="text-white text-sm flex flex-col items-center">
            <p className="text-zinc-400">Already have an account?</p>

            {/* Correct Next.js Button Link */}
            <Link href="/sign-in" passHref>
              <Button asChild>
                <span className="mt-2 bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-lg transition-all">
                  Sign in
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
