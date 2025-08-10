'use client'
import { LoadingSpinner } from './loading-spinner';
import { useIsNavigating } from '@/components/layout/navigation-state-manager';

interface PageLoadingProps {
  message?: string;
  showOnNavigation?: boolean;
}

export function PageLoading({ 
  message = "Loading page...", 
  showOnNavigation = true 
}: PageLoadingProps) {
  const isNavigating = useIsNavigating();
  
  // Only show if we're navigating or explicitly requested
  if (!showOnNavigation && !isNavigating) {
    return null;
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
}

// Skeleton loading component for content
export function PageSkeleton() {
  return (
    <div className="min-h-[400px] p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded-lg w-1/3"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/6"></div>
        <div className="h-4 bg-muted rounded w-3/6"></div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
