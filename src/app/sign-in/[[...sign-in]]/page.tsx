import { SignIn } from '@clerk/nextjs';
import Header from '@/components/header';

export default function Page() {
  return (
    <div className='h-[100%] space-y-20 w-full flex items-center flex-col justify-center'>
      <Header />
      <SignIn />
    </div>
  );
}
