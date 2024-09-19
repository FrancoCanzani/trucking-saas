import "./globals.css";
import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { Toaster } from "sonner";

const karla = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter AI tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${karla.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
