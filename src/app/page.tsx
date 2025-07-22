"use client";

import ConversionInfo from "@/components/sections/conversion-info";
import FileUpload from "@/components/sections/file-upload-section";
import SectionV from "@/components/sections/sectionV";

export default function Home() {
  return (
    <main className="p-4 ">
      {/* Upload files section */}
      <FileUpload />

      {/* Conversion info */}
      <ConversionInfo />
      
      {/* idk what to name this  */}
      <SectionV/>
    </main>
  );
}
