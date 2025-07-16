import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col   h-full">
      <Skeleton className="h-[80px] w-full bg-gray-300" />

      <div className="p-12">
        <h1 className="text-gray-500 text-2xl font-bold  ml-4">Overview </h1>
        <div className=" flex items-center gap-4 p-4 mt-2">
          <Skeleton className="h-28 w-full bg-gray-300" />
          <Skeleton className="h-28 w-full bg-gray-300" />
          <Skeleton className="h-28 w-full bg-gray-300" />
        </div>
        <div className=" flex items-center gap-4 p-4 ">
          <Skeleton className="h-54 w-full bg-gray-300" />
          <Skeleton className="h-54 w-full bg-gray-300" />
        </div>
        <div className=" flex items-center gap-4 p-4 ">
          <Skeleton className="h-80 w-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
