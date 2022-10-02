import { useState } from "react";
import { HiSearch } from "react-icons/hi";

const NavSearch = () => {
  const [visible, setVisible] = useState(false);

  const toggleSearch = () => {
    setVisible(!visible);
  };
  return (
    <form className="flex">
      <button
        onClick={toggleSearch}
        type="button"
        className={` text-base text-white hover:text-primary duration-300 ease-in-out transition-colors ${
          visible ? "bg-primary pl-4 pr-3 rounded-l-full hover:text-white" : "mr-4"
        }`}
      >
        <HiSearch />
      </button>
      <div
        className={`text-black transition-all duration-300 overflow-hidden rounded-r-full ${
          visible ? "overflow-auto w-52" : "w-0"
        }`}
      >
        <input type="text" placeholder="Search..." className="px-4 py-2 text-sm outline-none" />
      </div>
    </form>
  );
};

export default NavSearch;
