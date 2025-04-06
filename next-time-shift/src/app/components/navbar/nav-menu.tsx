import Link from "next/link";
import styles from "./nav-menu.module.css";
import { SignInButton } from "../auth/auth-buttons";

export default function NavMenu() {

  return (
    <nav className={styles.nav} >
      <Link href={'/'}>Home</Link>
      <div className={styles.menu}>
        <Link href={'/create'}>Create</Link>
        <Link href={'/edit'}>Edit</Link>
        <SignInButton />
      </div>
    </nav>
  ) 
}