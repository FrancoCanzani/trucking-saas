import Header from '@/components/header';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='h-[100%] space-y-20 w-full flex items-center flex-col justify-center'>
      <Header />
      <SignUp />
    </div>
  );
}
