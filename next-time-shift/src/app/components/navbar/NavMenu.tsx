import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { NavLink } from "./NavLink";

export default function NavMenu() {

  return (
    <nav className="fixed z-10 w-fit top-10 inset-shadow-sm drop-shadow-2xl left-1/2 translate-x-[-50%] flex items-center justify-between p-2 rounded-full bg-surface text-text">
      <Link className="bg-background rounded-full px-4 py-2 shadow-xl font-bold text-text" href={'/'}>Home</Link>
      <ul className="flex gap-2 md:gap-5 px-10">
        <li>
          <NavLink href={'/events'}>Events</NavLink>
        </li>
        <li>
          <NavLink href={'/friends'}>Friends</NavLink>
        </li>
        <li>
          <NavLink href={'/schedule'}>Schedule</NavLink>
        </li>
      </ul>
      <div className="bg-background rounded-full p-2 shadow-xl flex gap-2">
        <UserButton appearance={{
          elements : { userButtonAvatarBox: "size-full" }
        }}/>
      </div>
    </nav>
  ) 
}