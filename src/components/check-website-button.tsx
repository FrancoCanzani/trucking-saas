import { Website } from '@/lib/types';
import { createHealthCheck } from '@/lib/actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CheckWebsiteButton({
  website,
  className,
  children,
}: {
  website: Website;
  className?: string;
  children: React.ReactNode;
}) {
  async function handleSubmit() {
    try {
      const healthCheckPromise = createHealthCheck(website);

      toast.promise(healthCheckPromise, {
        loading: 'Performing health check...',
        success: (data) => {
          return `Health check ended with status ${data.status}`;
        },
        error: 'Error performing the health check.',
      });
    } catch (error) {
      toast.error('Error performing the health check.');
    }
  }
  return (
    <form action={handleSubmit}>
      <button className={cn('', className)}>{children}</button>
    </form>
  );
}
