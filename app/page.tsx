import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-32">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-accent mb-4">Welcome Back</h1>
        <p className="text-base text-text/70 mb-10">
          Sign in to your account to continue
        </p>

        <SignedOut>
          <div className="flex gap-3 justify-center items-center">
            <SignInButton mode="modal">
              <button className="border border-accent text-accent hover:bg-primary rounded-md font-medium text-sm px-6 py-2.5 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-accent hover:bg-accent/90 text-secondary rounded-md font-medium text-sm px-6 py-2.5 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="text-text text-base">
            Redirecting to your dashboard...
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
