'use client'

import * as config from "@/lib/config";
import Header from "@/app/components/header/header";
import style from "./home.module.css";

// ERROR PAGE
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className={style.home}>
      <Header title={config.title} subtitle="Something went wrong!" description={`err: ${error}`} />
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
