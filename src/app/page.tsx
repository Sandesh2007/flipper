"use client";

import Card from "@/components/card";
import FileDialog from "@/components/file-upload";

export default function Home() {
  return (
    <main className="p-4 ">
      <section className="flex flex-col justify-center gap-8 h-full" >
        <h3 className="text-neutral-950 dark:text-neutral-50 font-bold text-3xl text-center">
          Convert PDFs to flipbooks and more.
        </h3>

        <div className="self-center w-full max-w-lg">
          <FileDialog />
        </div>
      </section>

      <section className="flex flex-col justify-center gap-8 h-full p-4" >
        <p className="text-neutral-950 dark:text-neutral-50 font-bold text-2xl sm:text-3xl text-center">
          Turn your files into a...
        </p>

        <div className="flex flex-wrap gap-4 justify-center ">
          <Card
            name="Flipbook"
            image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
            hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
          />
          <Card
            name="Social Post"
            image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
            hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
          />
          <Card
            name="Article"
            image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
            hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
          />
          <Card
            name="GIF"
            image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
            hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
          />
        </div>

      </section>
    </main>
  );
}
