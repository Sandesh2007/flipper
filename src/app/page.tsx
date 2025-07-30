"use client";

import { ConversionInfo } from "@/components/sections/conversion-info";
import { FileUpload } from "@/components/sections/file-upload-section";
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

  const handleFileUpload = () => {
    // Redirect to upload page when file is uploaded
    router.push("/home/create");
  };

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
      <FileUpload onFileUpload={handleFileUpload} />
      <SupportedFormats />
      <ConversionInfo />
      <Testimonials />
    </main>
  );
}
