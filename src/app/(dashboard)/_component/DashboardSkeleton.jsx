import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col   h-full">
      <div className=" flex items-center gap-4 p-4 ">
        <Skeleton className="h-80 w-full bg-gray-300" />
      </div>
    </div>
  );
}
