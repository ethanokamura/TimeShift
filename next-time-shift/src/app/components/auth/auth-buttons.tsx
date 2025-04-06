'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import style from "./auth-button.module.css";
import Link from "next/link";
import Image from "next/image";
import AuthButtonSkeleton from "./image-skeleton";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <AuthButtonSkeleton />
  }

  if (status === 'authenticated') {
    return (
      <Link href={`/dashboard/`}>
        <Image
          className={style.pfp}
          src={session.user?.image ?? '/logo.svg'}
          width={48}
          height={48}
          alt="Profile Picture"
        />
      </Link>
    );
  }

  return <button className={style.button} onClick={() => signIn()}>Sign In</button>
}

export function SignOutButton() {
  return <button className={style.button} onClick={() => signOut()}>Sign Out</button>
}