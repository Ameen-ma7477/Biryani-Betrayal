import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biryani Betrayal | One pot. Twelve suspects.",
  description: "A biryani-themed game of secrets and sabotage for 4–12 friends.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
