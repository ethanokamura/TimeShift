"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export function NavLink({ className, ...props } : ComponentProps<typeof Link>) {
  const path = usePathname();
  const isActive = path === props.href;

  return (
    <Link {...props} className={`${isActive ? "text-text3" : "text-text"} ${className} text-base md:text-lg lg:text-xl`} />
  )
}