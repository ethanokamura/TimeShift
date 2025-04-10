import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { NavLink } from "./NavLink";

export default function PublicNavMenu() {

  return (
    <nav className="w-full pl-10 py-4 fixed z-10 top-0 left-0 flex items-center justify-between text-text">
      <Link className="font-bold text-text" href={'/'}>Home</Link>
      <ul className="flex gap-2 md:gap-5 px-10 items-center">
        <li>
          <NavLink href={'/events'}>Features</NavLink>
        </li>
        <li>
          <NavLink href={'/friends'}>Pricing</NavLink>
        </li>
        <li>
          <NavLink href={'/dashboard'}>Our Team</NavLink>
        </li>
        <li>
          <SignInButton/>
        </li>
      </ul>
    </nav>
  ) 
}