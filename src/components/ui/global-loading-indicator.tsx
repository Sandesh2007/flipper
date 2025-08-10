'use client'
import { useGlobalLoading } from './loading-state-manager';
import { LoadingSpinner } from './loading-spinner';

export function GlobalLoadingIndicator() {
  const isLoading = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] glass flex items-center justify-center">
      <div className="glass border border-border/50 rounded-2xl p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-foreground font-medium">Loading...</p>
      </div>
    </div>
  );
}
