import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import "next-static-search/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "next-static-search — live demo",
  description:
    "Instant Pagefind-powered search for statically exported Next.js sites.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics packageName="next-static-search" />
      </body>
    </html>
  );
}
