import Link from "next/link";

const ConditionalLink = ({ children, href, condition }: any) =>
  !!condition && href ? (
    <Link href={href}>
      <a className="no-underline">{children}</a>
    </Link>
  ) : (
    <>{children}</>
  );

export default ConditionalLink;
