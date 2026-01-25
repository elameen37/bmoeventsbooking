import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";

interface PageSkeletonProps {
  variant?: "default" | "pricing" | "dashboard" | "home";
}

const PageSkeleton = ({ variant = "default" }: PageSkeletonProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {variant === "default" && <DefaultSkeleton />}
          {variant === "pricing" && <PricingSkeleton />}
          {variant === "dashboard" && <DashboardSkeleton />}
          {variant === "home" && <HomeSkeleton />}
        </div>
      </main>
    </div>
  );
};

const DefaultSkeleton = () => (
  <>
    {/* Header */}
    <div className="mb-8 sm:mb-12 text-center">
      <Skeleton className="h-6 w-32 mx-auto mb-4 rounded-full" />
      <Skeleton className="h-10 w-80 mx-auto mb-3" />
      <Skeleton className="h-5 w-96 mx-auto max-w-full" />
    </div>

    {/* Content Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-6 rounded-xl border border-border bg-card/50">
          <Skeleton className="h-40 w-full mb-4 rounded-lg" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  </>
);

const PricingSkeleton = () => (
  <>
    {/* Header */}
    <div className="mb-8 sm:mb-12 text-center">
      <Skeleton className="h-6 w-40 mx-auto mb-4 rounded-full" />
      <Skeleton className="h-12 w-96 mx-auto mb-3 max-w-full" />
      <Skeleton className="h-5 w-80 mx-auto max-w-full" />
    </div>

    {/* Pricing Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-xl border border-border bg-card/50">
          <div className="text-center mb-4">
            <Skeleton className="h-12 w-12 mx-auto mb-3 rounded-full" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-8 w-24 mx-auto mb-2" />
          <Skeleton className="h-4 w-20 mx-auto mb-4" />
          <Skeleton className="h-6 w-28 mx-auto mb-6 rounded-full" />
          <div className="space-y-2 mb-6">
            {[1, 2, 3, 4, 5].map((j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>

    {/* Add-ons Section */}
    <div className="mb-10 sm:mb-16">
      <div className="text-center mb-6 sm:mb-8">
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  </>
);

const DashboardSkeleton = () => (
  <div className="flex-1">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 rounded-xl border border-border bg-card/50">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
      ))}
    </div>

    {/* Content Grid */}
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card/50">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card/50">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HomeSkeleton = () => (
  <>
    {/* Hero Section */}
    <div className="py-16 sm:py-24">
      <Skeleton className="h-6 w-40 mx-auto mb-6 rounded-full" />
      <Skeleton className="h-14 w-[600px] mx-auto mb-4 max-w-full" />
      <Skeleton className="h-14 w-[500px] mx-auto mb-6 max-w-full" />
      <Skeleton className="h-6 w-[450px] mx-auto mb-8 max-w-full" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-12 w-36 rounded-lg" />
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </div>

    {/* Featured Section */}
    <div className="py-12">
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-3" />
        <Skeleton className="h-5 w-96 mx-auto max-w-full" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-border bg-card/50">
            <Skeleton className="h-48 w-full mb-4 rounded-lg" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  </>
);

export default PageSkeleton;
