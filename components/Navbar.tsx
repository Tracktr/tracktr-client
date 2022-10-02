import Link from "next/link";
import NavButton from "./Navbutton";
import NavSearch from "./Navsearch";

const navLinks = [
  { href: "/movies", text: "Movies", active: false },
  { href: "/series", text: " Series", active: false },
  { href: "/calendar", text: " Calendar", active: false },
];

const Navbar = () => (
  <nav className="fixed top-0 w-screen bg-opacity-25 bg-primaryBackground filter backdrop-blur-md">
    <div className="max-w-6xl px-6 py-2 m-auto">
      <div className="grid grid-cols-3">
        <Link href="/">
          <a className="col-span-1">
            <h1 className="text-3xl font-black text-white">
              TRACKTR
              <span className="text-primary">.</span>
            </h1>
          </a>
        </Link>
        <ul className="flex items-center justify-center col-span-1">
          {navLinks.map((navItem) => (
            <NavButton key={navItem.text} href={navItem.href} text={navItem.text} active={navItem.active} />
          ))}
        </ul>
        <div className="flex items-center justify-end col-span-1">
          <NavSearch />
          <NavButton href="/signin" text="Sign in" active={false} />
          {/* 
            // TODO: User in navbar if logged in
          <div className="flex items-center text-white">
            <Image src="https://picsum.photos/100" width="36px" height="36px" className="rounded-full" />
            <p className="ml-2">Username</p>
          </div> */}
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
