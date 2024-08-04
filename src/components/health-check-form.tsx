'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { HealthCheckResponse } from '@/lib/types';
import HealthCheckOutput from './health-check-output';
import { Loader } from 'lucide-react';
import { Label } from './ui/label';

export default function HealthCheckForm() {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = formData.get('url') as string;

    try {
      if (url) {
        setLoading(true);
        const response = await fetch(
          `/api/healthCheck?url=${encodeURIComponent(url)}`
        );

        const result: HealthCheckResponse = await response.json();

        if (response.ok) {
          setHealthData(result);
        } else {
          setHealthData(result);
        }
      } else {
        toast.error('Invalid URL provided.');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while performing the health check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className='flex items-end justify-center space-x-4'
      >
        <div className='w-full'>
          <Label htmlFor='url'>Test Health Check</Label>
          <Input
            type='url'
            name='url'
            id='url'
            spellCheck='false'
            placeholder='URL'
            required
          />
        </div>
        <Button type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </form>

      {loading ? (
        <Loader className='mt-6 opacity-55 w-full m-auto animate-spin' />
      ) : (
        healthData && <HealthCheckOutput data={healthData} />
      )}
    </main>
  );
}
