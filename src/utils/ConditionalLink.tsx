import Link from "next/link";

const ConditionalLink = ({
  children,
  href,
  condition,
  className,
}: {
  children: JSX.Element | JSX.Element[];
  href: string | undefined;
  condition: boolean;
  className?: string;
}) =>
  !!condition && href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

export default ConditionalLink;
