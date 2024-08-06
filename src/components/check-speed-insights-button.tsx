import { Website } from '@/lib/types';
import { createPageSpeedInsights } from '@/lib/actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CheckSpeedInsightsButton({
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
      const healthCheckPromise = createPageSpeedInsights(website, "both");

      toast.promise(healthCheckPromise, {
        loading: 'Checking speed insights...',
        success: (data) => {
          return `Checked speed insights.`;
        },
        error: 'Error checking speed insights.',
      });
    } catch (error) {
      toast.error('Error checking speed insights.');
    }
  }
  return (
    <form action={handleSubmit}>
      <button className={cn('', className)}>{children}</button>
    </form>
  );
}
