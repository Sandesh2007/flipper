"use client";

import { ConversionInfo } from "@/components/sections/conversion-info";
import { FileUpload } from "@/components/sections/file-upload-section";
import { SupportedFormats } from "@/components/sections/supported-section";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
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
