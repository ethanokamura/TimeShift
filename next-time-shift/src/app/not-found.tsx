// 404 Page
import * as config from "@/data/constants";
import Link from "next/link";
import Header from "@/app/components/header/Header";

export default function Custom404() {
  return (
    <main className="home">
      <Header title={config.title} subtitle="404 - Page Not Found" description="Looks like something went wrong!" />
      <Link href={'/'}>
        <button>
          Return Home
        </button>
      </Link>
    </main>
  )
}
