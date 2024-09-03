import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      Truckio
      <div className="flex items-center gap-x-3">
        <Link href={"/sign-in"}>Sign in</Link>
        <Link href={"/sign-up"}>Sign Up</Link>
      </div>
    </header>
  );
}
