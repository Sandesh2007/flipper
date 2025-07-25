"use client";

import { ConversionInfo } from "@/components/sections/conversion-info";
import { FileUpload } from "@/components/sections/file-upload-section";
import { SupportedFormats } from "@/components/sections/supported-section";
import { Testimonials } from "@/components/testimonials";
import { useAuth } from "@/components/auth-context";
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
    // add a loader here
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <main className="p-4 ">
      {/* Upload files section */}
      <FileUpload />
      <SupportedFormats />
      <ConversionInfo />
      <Testimonials />
    </main>
  );
}
