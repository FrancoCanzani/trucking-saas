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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeleteWebsiteButton from '@/components/delete-website-button';

export const columns: ColumnDef<Website>[] = [
  {
    id: 'status',
    cell: ({ row }) => {
      const healthChecks: HealthCheck[] = row.getValue('healthChecks');
      const lastCheck: HealthCheck | undefined = healthChecks.slice(-1)[0];
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='flex items-center justify-center'>
              <div
                className={`h-4 w-4 rounded-full text-white font-medium flex items-center justify-center ${
                  lastCheck && lastCheck.status > 200
                    ? 'bg-red-600'
                    : lastCheck && lastCheck.status <= 200
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}
              >{
                lastCheck && lastCheck.status > 200
                    ? <svg width="1rem" height="1rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    : lastCheck && lastCheck.status <= 200
                    ? <svg width="1rem" height="1rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    : '<svg width="1rem" height="1rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM4.50003 7C4.22389 7 4.00003 7.22386 4.00003 7.5C4.00003 7.77614 4.22389 8 4.50003 8H10.5C10.7762 8 11 7.77614 11 7.5C11 7.22386 10.7762 7 10.5 7H4.50003Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>'
              }</div>
            </TooltipTrigger>
            <TooltipContent className='font-medium'>
              {lastCheck
                ? lastCheck.status > 200
                  ? 'Failing'
                  : 'Passing'
                : 'No checks yet'}
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
        <a
        href={row.getValue('url')}
        target='_blank'
          className='font-medium w-[200px] lg:w-max truncate flex items-center justify-start gap-x-2'
          title={row.getValue('url')}
        >
          {row.getValue('url')}
        </a>
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
                <TooltipProvider key={check.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`p-0.5 group-hover:opacity-60 hover:!opacity-100 hover:-translate-y-1 transition-all duration-150 ${
                          check.status === 200 ? 'bg-green-500' : 'bg-red-600'
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
                </TooltipProvider>
              );
            })
          ) : (
            <div className='text-sm text-gray-500'>No health checks yet</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'check_interval',
    header: () => (
      <div className='hidden md:table-cell'>Check Interval</div>
    ),
    cell: ({ row }) => {
      return (
        <div className='font-medium hidden md:table-cell'>
          {`${row.getValue('check_interval')} days`}
        </div>
      );
    },
  },
  {
    accessorKey: 'notify_email',
    header: () => (
      <div className='hidden md:table-cell'>Alert Email</div>
    ),
    cell: ({ row }) => {
      return (
        <div className='font-medium hidden md:table-cell'>
          {row.getValue('notify_email')}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: () => (
      <div className='hidden md:table-cell'>Created</div>
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('created_at'));
      const distance = formatDistance(createdAt, new Date(), {
        addSuffix: true,
      });

      return (
        <div className='font-medium capitalize hidden md:table-cell'>
          {distance}
        </div>
      );
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
