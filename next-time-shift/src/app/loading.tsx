import SkeletonHeader from "@/app/components/header/SkeletonHeader";

export default function Loading() {
  return (
    <main>
      <SkeletonHeader />
      <div className="h-10 w-full bg-text3 animate-pulse"></div>
    </main>
  );
}
