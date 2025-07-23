import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/client-layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Book publishing Website",
  description: "Create stunning digital books",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
      className={`${poppins.className} antialiased scroll-smooth`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <ClientLayout>
            {children}
            <Toaster
            position="top-center"
            />
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
