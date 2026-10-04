import type { Metadata } from "next";
import { Geist, Outfit } from "next/font/google";
import { ClerkProviderClient } from "@/components/providers/ClerkProviderClient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepInMinutes — Get interview-ready in minutes.",
  description:
    "PrepInMinutes analyzes your resume, target role, and job description to create a personalized interview preparation journey.",
  icons: {
    icon: [{ url: "/images/icons/icon.png", type: "image/png", sizes: "48x48" }],
    shortcut: "/images/icons/icon.png",
    apple: "/images/icons/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProviderClient
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          {children}
        </ClerkProviderClient>
      </body>
    </html>
  );
}
