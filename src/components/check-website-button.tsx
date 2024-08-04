import { Website } from '@/lib/types';
import { createHealthCheck } from '@/lib/actions';
import { SubmitButton } from './submit-button';
import { toast } from 'sonner';

export default function CheckWebsiteButton({ website }: { website: Website }) {
  async function handleSubmit() {
    try {
      const healthCheckPromise = createHealthCheck(website);

      toast.promise(healthCheckPromise, {
        loading: 'Performing health check...',
        success: (data) => {
          return `Health check ended with status ${data.status} - ${data.statusText}.`;
        },
        error: 'Error performing the health check.',
      });
    } catch (error) {
      toast.error('Error performing the health check.');
    }
  }
  return (
    <form action={handleSubmit}>
      <SubmitButton className='text-xs font-bold hover:underline rounded-md px-3 p-0 h-0 text-black bg-none border-none'>
        Check
      </SubmitButton>
    </form>
  );
}
