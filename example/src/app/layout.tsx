import type { Metadata } from "next";

import { ReactStaticSearch } from "react-static-search";

import "./globals.css";

import "react-static-search/dist/style.min.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Example for react-static-search",
  description: "Example for react-static-search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <header className="flex justify-center items-center w-full py-4 bg-gray-300">
          <div className="flex items-center justify-between gap-12 container">
            <div className="flex items-center justify-center gap-8">
              <Link href={"/"} className="font-bold text-2xl">React Static Search</Link>
              <nav>
                <Link href={"/"}>Home</Link>
              </nav>
            </div>
            <ReactStaticSearch />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
