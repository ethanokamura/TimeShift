import style from "./loading.module.css";
import SkeletonHeader from "@/app/components/header/skeleton-header";

export default function Loading() {
  return (
    <main>
      <SkeletonHeader />
      <div className={style.skeletonContent}></div>
    </main>
  );
}
