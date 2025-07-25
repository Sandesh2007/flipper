import { Metadata } from 'next';
import FuzzyText from '@/components/fuzzy-text';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-8 gap-6">
      <FuzzyText
        fontSize="clamp(2.5rem, 10vw, 8rem)"
        fontWeight={900}
        fontFamily="inherit"
        enableHover={true}
        className="text-neutral-900 dark:text-neutral-50 text-4xl sm:text-6xl md:text-8xl"
        baseIntensity={0.18}
        hoverIntensity={0.5}
      >
        404
      </FuzzyText>
      <FuzzyText
        fontSize="clamp(1.5rem, 5vw, 3rem)"
        fontWeight={900}
        fontFamily="inherit"
        enableHover={true}
        className="text-neutral-700 dark:text-neutral-300 text-lg sm:text-2xl md:text-4xl text-center"
        baseIntensity={0.18}
        hoverIntensity={0.5}>
        Page Not Found
      </FuzzyText>
      <Link href="/" className="w-full sm:w-auto">
        <Button
          variant="outline"
          className="w-full sm:w-auto p-4 text-neutral-50 cursor-pointer bg-neutral-700 dark:bg-neutral-900 text-base sm:text-lg"
        >
          Go Home
        </Button>
      </Link>
    </div>
  );
}