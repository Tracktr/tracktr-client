import Link from "next/link";

interface iNavButton {
  href: string;
  text: string;
  active: boolean;
  className?: string;
}

const NavButton = ({ href, text, active, className }: iNavButton) => (
  <li className={`inline-block text-white list-none group ${className}`}>
    <Link href={href}>
      <a className={`group-hover:text-primary px-4 py-2 inline-block ${active ? "font-bold" : ""}`}>{text}</a>
    </Link>
  </li>
);

NavButton.defaultProps = {
  className: "",
};

export default NavButton;
