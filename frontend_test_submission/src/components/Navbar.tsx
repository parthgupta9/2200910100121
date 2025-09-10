import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow">
      <div className="max-w-4xl mx-auto flex justify-between">
        <Link href="/" className="font-bold hover:text-blue-400">
          URL Shortener
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-400">
            Shorten
          </Link>
          <Link href="/stats" className="hover:text-blue-400">
            Stats
          </Link>
        </div>
      </div>
    </nav>
  );
}
