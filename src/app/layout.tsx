import type { Metadata } from "next";
import  Favicon  from "/public/favicon.svg";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata: Metadata = {
  title: "GarageSync",
  description: "Comprehensive Pos system for Automotive repair shop",
  icons: [{ rel: 'icon', url: Favicon.src }],

};
import { Providers } from "./providers";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <SessionProvider>{children}</SessionProvider>
          </Providers>
        </ThemeProvider>
        <ToastContainer theme="colored" />
      </body>
    </html>
  );
}
