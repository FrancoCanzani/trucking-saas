import { Input } from './ui/input';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { createWebsiteToCheck } from '@/lib/actions';
import { toast } from 'sonner';
import { FormEvent, createRef } from 'react';

export default function CreateCheckForm() {
  const ref = createRef<HTMLFormElement>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const healthCheckPromise = createWebsiteToCheck(formData);

      toast.promise(healthCheckPromise, {
        loading: 'Performing health check...',
        success: () => {
          return `Added site to your websites.`;
        },
        error: 'Error adding sites.',
      });

      ref?.current?.reset()
    } catch (error) {
      toast.error('Error adding site.');
    }
  }

  return (
    <form ref={ref}
      onSubmit={handleSubmit}
      className='flex items-center justify-end space-x-2'
    >
      <Input
        placeholder='https://wikipedia.com'
        type='url'
        name='url'
        required
      />
      <Button type='submit' size='sm' className='h-9 gap-1'>
        <PlusCircle className='h-3.5 w-3.5' />
        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
          Create Check
        </span>
      </Button>
    </form>
  );
}
