export default function SkeletonHeader() {
  return (
    <header className="my-auto py-4 w-2xl flex flex-col gap-6 animate-pulse">
      <div className="h-10 w-full bg-text rounded"></div>
      <div className="h-8 w-4/5 bg-text rounded"></div>
      <div className="h-6 w-full bg-text rounded"></div>
    </header>
  );
}

