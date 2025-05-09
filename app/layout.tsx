import type {Metadata} from "next";
import {Mona_Sans} from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";

const monaSans = Mona_Sans({
    variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI Job Interview",
    description: "An AI-powered mock interview application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="dark">
      <body
          className={`${monaSans.className} antialiased`}
      >
      {children}

      <Toaster/>
      </body>
    </html>
  );
}
