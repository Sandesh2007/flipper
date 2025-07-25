import { Metadata } from 'next';
import FuzzyText from '@/components/fuzzy-text';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-">
      <FuzzyText
        fontSize="clamp(2rem, 8vw, 8rem)"
        fontWeight={900}
        fontFamily="inherit"
        enableHover={true}
        className="text-neutral-900 dark:text-neutral-50"
        baseIntensity={0.18}
        hoverIntensity={0.5}
      >
        404
      </FuzzyText>
      <FuzzyText
        fontSize="clamp(2rem, 8vw, 8rem)"
        fontWeight={900}
        fontFamily="inherit"
        enableHover={true}
        baseIntensity={0.18}
        hoverIntensity={0.5}>
        Page Not Found
      </FuzzyText>
      <Link href="/">
        <Button
          variant="outline"
          className="p-4 text-neutral-50 cursor-pointer bg-neutral-700 dark:bg-neutral-900"
        >
          Go Home
        </Button>
      </Link>
    </div>
  );
}