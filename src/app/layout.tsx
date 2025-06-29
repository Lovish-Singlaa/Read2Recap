import type { Metadata } from "next";
import { Inter, Source_Sans_3 as SansFont } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const fontSans = SansFont({ 
  subsets: ["latin"] ,
  weight: ["200","300","400", "500", "600", "700","800","900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Document Summarizer",
  description: "Upload and summarize your documents using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} antialiased font-sans bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
