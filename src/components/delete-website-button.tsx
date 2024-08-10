import { Website } from '@/lib/types';
import { deleteWebsite } from '@/lib/actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function DeleteWebsiteButton({
  website,
  className,
  children,
}: {
  website: Website;
  className?: string;
  children: React.ReactNode;
}) {
  async function handleClick() {
    try {
      const healthCheckPromise = deleteWebsite(website.id);

      toast.promise(healthCheckPromise, {
        loading: `Deleting ${website.url}...`,
        success: (data) => {
          return `Deleted ${website.url}.`;
        },
        error: `Error deleting ${website.url}.`,
      });
    } catch (error) {
      toast.error(`Deleting ${website.url}...`);
    }
  }
  return (
    <button onClick={handleClick} className={cn('text-red-600', className)}>
      {children}
    </button>
  );
}
