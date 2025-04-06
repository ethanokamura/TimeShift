import * as config from "@/lib/config";
import Header from "@/app/components/header/header";
import style from "./home.module.css";

export default function HomePage() {
  return (
    <main className={style.home}>
      <Header title={config.title} subtitle="File Management System" description={config.description} />
    </main>
  );
}
