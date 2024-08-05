import { Website } from '@/lib/types';
import { deleteWebsite } from '@/lib/actions';
import { toast } from 'sonner';

export default function DeleteWebsiteButton({ website }: { website: Website }) {
  async function handleSubmit() {
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
    <form action={handleSubmit}>
      <button className='text-red-600'>Delete website</button>
    </form>
  );
}
