import { Input } from './ui/input';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { createWebsiteToCheck } from '@/lib/actions';

export default function CreateCheckForm() {
  return (
    <form
      action={createWebsiteToCheck}
      className='flex items-center justify-end space-x-2'
    >
      <Input
        placeholder='https://wikipedia.com'
        type='url'
        name='url'
        required
      />
      <Button size='sm' className='h-9 gap-1'>
        <PlusCircle className='h-3.5 w-3.5' />
        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
          Create Check
        </span>
      </Button>
    </form>
  );
}
