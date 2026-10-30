import { ContentSkeleton, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="mb-6 h-4 w-72" />
      <ContentSkeleton />
    </>
  );
}
