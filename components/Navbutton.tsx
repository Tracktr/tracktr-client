import Link from 'next/link';

interface iNavButton {
  href: string,
  text: string,
  active: boolean,
}

const NavButton = ({ href, text, active }: iNavButton) => {
  return (
    <li className="inline-block text-white list-none group">
      <Link href={href}>
        <a className={`group-hover:text-primary px-4 py-2 inline-block ${active ? 'font-bold' : ''}`}>{text}</a>
      </Link>
    </li>
  );
};

export default NavButton;
