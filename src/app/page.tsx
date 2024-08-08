import Header from '../components/header';
import HealthCheckForm from '@/components/health-check-form';
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = auth();

  return (
    <main className='p-3 md:p-6 space-y-28 max-w-5xl m-auto'>
    <header className='flex w-full font-medium capitalize mb-4 items-center justify-between'>
      {userId && <Link href={'/dashboard'}>Dashboard</Link>}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </header>      <HealthCheckForm />
    </main>
  );
}
