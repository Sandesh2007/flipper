"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/auth/register'];
  const isLoginPage = noLayoutRoutes.includes(pathname);

  return (
    <>
      {!isLoginPage && (
        <header className="sticky top-0 z-50 border-b-[1px] border-neutral-700 ">
          <Navbar />
        </header>
      )}
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
}
