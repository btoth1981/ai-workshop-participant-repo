import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stresszlabda Shop",
    template: "%s | Stresszlabda Shop",
  },
  description:
    "Stresszoldó labdák webshopja — szorítsd, gyúrd, lazíts!",
};

// Header navigation (spec plan.md §2 routes). Links to pages that do not
// exist yet (T4–T6) intentionally 404 until those tasks land.
const navItems = [
  { href: "/", label: "Főoldal" },
  { href: "/termekek", label: "Termékek" },
  { href: "/kosar", label: "Kosár" },
  { href: "/kapcsolat", label: "Kapcsolat" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="font-medium">
              Stresszlabda Shop
            </Link>
            <nav aria-label="Fő navigáció">
              <ul className="flex flex-wrap items-center gap-4 text-sm">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted-foreground">
            <p>Stresszlabda Shop — szorítsd, gyúrd, lazíts!</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
