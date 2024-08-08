'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HealthCheck, Website } from '@/lib/types';
import { formatDistance } from 'date-fns';
import CheckWebsiteButton from '@/components/check-website-button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeleteWebsiteButton from '@/components/delete-website-button';
import { cn } from '@/lib/utils';
import CheckSpeedInsightsButton from '@/components/check-speed-insights-button';
import { ArrowUpDown } from "lucide-react";
import Link from 'next/link';

export const columns: ColumnDef<Website>[] = [
  {
    id: 'status',
    header: () => <div className='flex items-center justify-center w-full'><Activity size={14}/></div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const lastCheck: HealthCheck | undefined = healthChecks.slice(-1)[0];
      return (
        <Tooltip>
          <TooltipTrigger className='flex items-center justify-center w-full'>
            <div
              className={`h-4 w-4 rounded-full text-white font-medium flex items-center justify-center ${
                lastCheck && lastCheck.status > 200
                  ? 'bg-red-500'
                  : lastCheck && lastCheck.status <= 200
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }`}
            >
              {
                lastCheck && lastCheck.status > 200
                  ? <svg width="1rem" height="1rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  : lastCheck && lastCheck.status <= 200
                  ? <svg width="1rem" height="1rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  : <svg width="1rem" height="1rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              }
            </div>
          </TooltipTrigger>
          <TooltipContent className='font-medium'>
            {lastCheck
              ? lastCheck.status > 200
                ? 'Failing'
                : 'Passing'
              : 'No checks'}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'url',
    header: ({ column }) => (
      <button 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className='truncate text-start flex gap-x-1 items-center'>
        Host <ArrowUpDown size={12}/>
      </button>
    ),
    cell: ({ row }) => {   
      const name = new URL(row.getValue('url')).host
      const id = row.original.id;

      return (
        <Link
        href={`/dashboard/monitoring/${id}`} 
        className='font-medium hover:underline truncate flex items-center justify-start gap-x-2'
          title={row.getValue('url')}
        >
          <span className='bg-slate-50 rounded shadow-sm border p-1'>{name}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: 'healthChecks',
    header: () => <div className='w-max'>Latest Checks</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const slicedHealthChecks = healthChecks.slice(-24);
      const maxResponseTime = Math.max(
        ...slicedHealthChecks.map((check) => check.response_time),
        1 // Fallback to 1 if array is empty
      );

      return (
        <div className='flex items-end group justify-center w-fit space-x-1'>
          {slicedHealthChecks.length > 0 ? (
            slicedHealthChecks.map((check) => {
              const minHeight = 25;
              const maxHeight = 35;
              const normalizedHeight = Math.max(
                minHeight,
                (check.response_time / maxResponseTime) * maxHeight
              );

              return (
                <Tooltip key={check.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`p-0.5 px-0.5 group-hover:opacity-60 hover:!opacity-100 hover:-translate-y-1 transition-all duration-150 ${
                        check.status === 200 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        height: `${normalizedHeight}px`,
                        width: '2px',
                      }}
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
              );
            })
          ) : (
            <div className='text-xs font-medium text-gray-500'>-</div>
          )}
        </div>
      );
    },
  },
  {
    id: 'lastHealthCheck',
    header: () => <div>Last Health Check</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const lastCheck: HealthCheck | undefined = healthChecks.slice(-1)[0];
      return (
        <div className='font-medium'>
          {lastCheck
            ? formatDistance(lastCheck.checked_at, new Date(), { addSuffix: true })
            : <span className='text-gray-500'>-</span>}
        </div>
      );
    },
  },
  {
    id: 'uptime',
    header: () => <div>Uptime</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');

      if (healthChecks.length === 0) {
        return <div className='text-xs font-medium text-gray-500'>-</div>;
      }

      const totalChecks = healthChecks.length;
      const successfulChecks = healthChecks.filter(
        (check) => check.status <= 200
      ).length;

      const uptimePercentage = (successfulChecks / totalChecks) * 100;

      return (
        <div className={cn('font-medium')}>
          {uptimePercentage.toFixed()}%
        </div>
      );
    },
  },
  {
    id: 'p50',
    header: () => <div>P50</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const p50 = healthChecks.length > 0 ? row.original.percentiles.p50 : undefined;
      return <div className='font-medium'>{p50 !== undefined ? Math.round(p50) + ' ms' : <span className='text-gray-500'>-</span>}</div>;
    },
  },
  {
    id: 'p75',
    header: () => <div>P75</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const p75 = healthChecks.length > 0 ? row.original.percentiles.p75 : undefined;
      return <div className='font-medium'>{p75 !== undefined ? Math.round(p75) + ' ms' : <span className='text-gray-500'>-</span>}</div>;
    },
  },
  {
    id: 'p90',
    header: () => <div>P90</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const p90 = healthChecks.length > 0 ? row.original.percentiles.p90 : undefined;
      return <div className='font-medium'>{p90 !== undefined ? Math.round(p90) + ' ms' : <span className='text-gray-500'>-</span>}</div>;
    },
  },
  {
    id: 'p99',
    header: () => <div>P99</div>,
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const p99 = healthChecks.length > 0 ? row.original.percentiles.p99 : undefined;
      return <div className='font-medium'>{p99 !== undefined ? Math.round(p99) + ' ms' : <span className='text-gray-500'>-</span>}</div>;
    },
  },
  {
    id: 'check',
    cell: ({ row }) => {
      const website: Website = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <Ellipsis className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <CheckWebsiteButton website={website}>
                Check website
              </CheckWebsiteButton>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckSpeedInsightsButton website={website}>
                Check speed insights
              </CheckSpeedInsightsButton>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteWebsiteButton website={website}>
                Delete website
              </DeleteWebsiteButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
