import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Plus One",
  description: "Going out is better with a plus one.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-display">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Nav />
          <main className="mt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
