import { Website } from '@/lib/types';
import { createHealthCheck } from '@/lib/actions';
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
      <button>Check website</button>
    </form>
  );
}
