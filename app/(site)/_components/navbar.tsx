"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="bg-secondary shadow-sm p-2 flex items-center justify-end">
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
        <SignOutButton>
          <button className="bg-[#141E32] hover:bg-accent/90 text-white rounded-md font-medium text-sm px-6 py-2.5 transition-colors">
            Sign Up
          </button>
        </SignOutButton>
      </SignedIn>
    </nav>
  );
}
