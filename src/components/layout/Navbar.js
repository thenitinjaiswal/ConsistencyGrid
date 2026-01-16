import Link from "next/link";

export default function Navbar({
  rightLinkText = "Log in",
  rightLinkHref = "/login",
}) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-orange-500" />
        <span className="text-sm font-semibold text-gray-900">
          ConsistencyGrid
        </span>
      </Link>

      <Link
        href={rightLinkHref}
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
      >
        {rightLinkText}
      </Link>
    </header>
  );
}

