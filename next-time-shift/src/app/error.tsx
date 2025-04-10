'use client'

import * as config from "@/data/constants";
import Header from "@/app/components/header/Header";

// ERROR PAGE
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="home">
      <Header title={config.title} subtitle="Something went wrong!" description={`err: ${error}`} />
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
