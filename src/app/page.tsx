"use client";

import { ConversionInfo } from "@/components/sections/conversion-info";
import { FileUpload } from "@/components/sections/file-upload";
import { SupportedFormats } from "@/components/sections/supported-section";
import { Testimonials } from "@/components/features/testimonials";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home/publisher");
    }
  }, [user, loading, router]);

  if (!loading && user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Transform PDFs into Interactive Flipbooks
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your PDF documents and convert them into beautiful, interactive flipbooks that engage your audience.
          </p>
        </div>
        
        {/* Upload files section */}
        <FileUpload />
      </section>
      
      <SupportedFormats />
      <ConversionInfo />
      <Testimonials />
    </main>
  );
}
