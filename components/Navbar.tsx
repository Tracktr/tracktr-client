import { HiSearch } from 'react-icons/hi';
import NavButton from './Navbutton';

const navLinks = [
  { href: '#', text: 'Movies', active: false },
  { href: '#', text: ' Series', active: false },
  { href: '#', text: ' Calendar', active: false },
];

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-screen bg-opacity-25 bg-primaryBackground filter backdrop-blur-md">
      <div className="max-w-6xl px-6 py-4 m-auto">
        <div className="flex justify-between">
          <h1 className="text-3xl font-black text-white">
            TRACKTR
            <span className="text-primary">.</span>
          </h1>
          <ul className="flex justify-between">
            {navLinks.map((navItem) => {
              return (
                <NavButton
                  key={navItem.text}
                  href={navItem.href}
                  text={navItem.text}
                  active={navItem.active}
                />
              );
            })}
          </ul>
          <div className="flex items-center justify-between">
            <button type="button" className="mr-4 text-base text-white">
              <HiSearch />
            </button>
            <NavButton href="#" text="Sign in" active={false} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
