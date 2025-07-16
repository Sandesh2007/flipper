"use client"

import FileDialog from "@/components/file-upload";

export default function Home() {
  return (
    <main className="p-4" >
      <div className="flex flex-col justify-center gap-8"  >
        <h3 className="text-neutral-950 dark:text-neutral-50 font-bold text-3xl self-center text-wrap" >
          Convert PDFs to flipbooks and more.
        </h3>
        <div className="self-center w-full " >
        <FileDialog />
        </div>
      </div>
    </main>
  );
}
