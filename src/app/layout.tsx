import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/layout/client-layout";
import { AuthProvider } from "@/components/auth/auth-context";
import { PdfUploadProvider, PublicationsProvider } from '@/components';
import { NetworkStatus } from "@/components/features/network-status";
import { NavigationStateManager } from "@/components/layout/navigation-state-manager";
import { PageTransition } from "@/components/ui/page-transition";

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
        className={`${poppins.className} bg-transparent antialiased scroll-smooth`}>
        <PdfUploadProvider>
          <AuthProvider>
            <PublicationsProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
              >
                <ClientLayout>
                  <NavigationStateManager />
                  <Toaster
                    position="top-center"
                  />
                  <NetworkStatus/>
                  <PageTransition>
                    {children}
                  </PageTransition>
                </ClientLayout>
              </ThemeProvider>
            </PublicationsProvider>
          </AuthProvider>
        </PdfUploadProvider>
      </body>
    </html>
  );
}
