import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default function Header() {
  const { userId } = auth();

  return (
    <header className='flex w-full font-medium capitalize mb-4 items-center justify-between'>
      {userId && <Link href={'/dashboard'}>Dashboard</Link>}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </header>
  );
}
