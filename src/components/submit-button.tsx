'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Ellipsis } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className={cn('', className)}>
      {pending ? (
        <Ellipsis size={14} className='animate-ping' />
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}
