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
        fontSize="clamp(3rem, 20vw, 6rem)"
        fontWeight={900}
        fontFamily="inherit"
        enableHover={true}
        color='gray'
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
        color='gray'
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