'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HealthCheck, Website } from '@/lib/types';
import { formatDistance } from 'date-fns';
import CheckWebsiteButton from '@/components/check-website-button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

export const columns: ColumnDef<Website>[] = [
  {
    id: 'status',
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const lastCheck: HealthCheck | undefined = healthChecks.slice(-1)[0];
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={`h-4 w-4 rounded-full ${
                  lastCheck && lastCheck.status > 200 ? 'bg-red-600' : 
                  lastCheck && lastCheck.status <= 200 ? 'bg-green-400' : 
                  'bg-gray-400'
                }`}
              ></div>
            </TooltipTrigger>
            <TooltipContent className='font-medium'>
              {lastCheck ? 
                (lastCheck.status > 200 ? 'Failing' : 'Passing') : 
                'No checks yet'
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'url',
    header: () => <div className='w-[200px] truncate'>URL</div>,
    cell: ({ row }) => {
      return (
        <div
          className='font-medium w-[200px] lg:w-max truncate'
          title={row.getValue('url')}
        >
          {row.getValue('url')}
        </div>
      );
    },
  },
  {
    accessorKey: 'healthChecks',
    header: () => <div className='w-max'>Last Checks</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const slicedHealthChecks = healthChecks.slice(-24);
      const maxResponseTime = Math.max(
        ...slicedHealthChecks.map((check) => check.response_time),
        1  // Fallback to 1 if array is empty
      );

      return (
        <div className='flex items-end group justify-center w-fit space-x-1'>
          {slicedHealthChecks.length > 0 ? slicedHealthChecks.map((check) => {
            const minHeight = 25;
            const maxHeight = 35;
            const normalizedHeight = Math.max(
              minHeight,
              (check.response_time / maxResponseTime) * maxHeight
            );

            return (
              <TooltipProvider key={check.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`p-0.5 group-hover:opacity-60 hover:!opacity-100 hover:-translate-y-1 transition-all duration-150 ${
                        check.status === 200 ? 'bg-green-400' : 'bg-red-600'
                      }`}
                      style={{ height: `${normalizedHeight}px`, width: '2px' }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className='space-y-2 text-xs'>
                    {check.status > 200 ? (
                      <div className='flex items-center font-medium justify-start text-sm'>
                        Failed
                        <p className='capitalize font-normal ml-1'>
                          {formatDistance(check.checked_at, new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    ) : (
                      <div className='flex items-center font-medium justify-start text-sm'>
                        Passed
                        <p className='capitalize font-normal ml-1'>
                          {formatDistance(check.checked_at, new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    )}
                    <div className='flex text-sm items-center font-medium justify-start space-x-2'>
                      {check.response_time} ms {check.status} status
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }) : (
            <div className='text-sm text-gray-500'>No health checks yet</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'check_interval',
    header: () => (
      <div className='hidden p-0 md:table-cell md:p-4'>Check Interval</div>
    ),
    cell: ({ row }) => {
      return (
        <div className='font-medium hidden p-0 md:table-cell md:p-4'>
          {`${row.getValue('check_interval')} days`}
        </div>
      );
    },
  },
  {
    accessorKey: 'notify_email',
    header: () => (
      <div className='hidden p-0 md:table-cell md:p-4'>Alert Email</div>
    ),
    cell: ({ row }) => {
      return (
        <div className='font-medium hidden p-0 md:table-cell md:p-4'>
          {row.getValue('notify_email')}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: () => (
      <div className='hidden p-0 md:table-cell md:p-4'>Created At</div>
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('created_at'));
      const distance = formatDistance(createdAt, new Date(), {
        addSuffix: true,
      });

      return (
        <div className='font-medium capitalize hidden p-0 md:table-cell md:p-4'>
          {distance}
        </div>
      );
    },
  },
  {
    id: 'check',
    cell: ({ row }) => {
      const website: Website = row.original;
      return <CheckWebsiteButton website={website} />;
    },
  },
];