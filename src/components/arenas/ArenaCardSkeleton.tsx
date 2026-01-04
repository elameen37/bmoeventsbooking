import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ArenaCardSkeleton = () => {
  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="flex flex-col">
        {/* Marquee Skeleton */}
        <div className="border-b border-border py-2 sm:py-3">
          <div className="flex gap-2 overflow-hidden px-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 sm:h-20 w-24 sm:w-32 flex-shrink-0 rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-0">
          {/* Main Image Skeleton */}
          <div className="relative h-48 sm:h-64 md:h-full">
            <Skeleton className="w-full h-full rounded-none" />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          {/* Content Skeleton */}
          <CardContent className="md:col-span-2 p-4 sm:p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:flex-wrap items-center md:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="space-y-2 w-full md:w-auto text-center md:text-left">
                  <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
                </div>
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>

              {/* Description */}
              <div className="space-y-2 mb-3 sm:mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto md:mx-0" />
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 justify-center md:justify-start">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-8 w-28 rounded-lg" />
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-3 sm:pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="flex flex-wrap gap-3 sm:gap-6 justify-center md:justify-start">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default ArenaCardSkeleton;
