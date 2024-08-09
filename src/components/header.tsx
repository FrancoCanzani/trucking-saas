'use client'

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className='sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
      <Link href={'/dashboard'}>Dashboard</Link>
    <SignOutButton />
      {isSignedIn && (
        <p className='font-medium'>Hello, {user.firstName} 👋</p>
      )}
    </header>
  );
}
