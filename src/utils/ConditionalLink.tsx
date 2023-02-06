import Link from "next/link";

const ConditionalLink = ({
  children,
  href,
  condition,
}: {
  children: JSX.Element | JSX.Element[];
  href: string | undefined;
  condition: boolean;
}) =>
  !!condition && href ? (
    <Link href={href}>
      <a className="no-underline">{children}</a>
    </Link>
  ) : (
    <>{children}</>
  );

export default ConditionalLink;
