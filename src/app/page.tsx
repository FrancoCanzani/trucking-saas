import Header from '../components/header';
import HealthCheckForm from '@/components/health-check-form';

export default async function Home() {
  const res = await fetch(`${process.env.URL}/api/ping}`)

  console.log(res);
  
  return (
    <main className='p-3 md:p-6 space-y-28 max-w-5xl m-auto'>
      <Header />
      <HealthCheckForm />
    </main>
  );
}
