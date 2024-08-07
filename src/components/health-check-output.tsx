import { HealthCheckResponse } from '@/lib/types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import httpStatusCodes from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function HealthCheckOutput({
  data,
}: {
  data: HealthCheckResponse;
}) {
  const formattedJSON = JSON.stringify(
    {
      status: data.status,
      statusText: data.statusText,
      message: data.message,
      url: data.url,
      responseTime: data.responseTime,
      ...(data.location && { location: data.location }),
      ...(data.error && { error: data.error }),
      ...(data.browserInfo && { browserInfo: data.browserInfo }),
      ...(data.performanceMetrics && { performanceMetrics: data.performanceMetrics }),
    },
    null,
    2
  );

  const isSuccessful = data.status >= 200 && data.status < 300;

  return (
    <div className='mt-6 w-full m-auto'>
      <div
        className={cn(
          'p-1.5 border hover:shadow transition-all duration-200 flex flex-col space-y-4 rounded text-sm',
          {
            'bg-green-100 hover:shadow-green-100': isSuccessful,
            'bg-red-100  hover:shadow-red-100': !isSuccessful,
          }
        )}
      >
        <div className='border-b border-gray-500 font-semibold flex items-center justify-between p-1.5 py-2.5'>
          <div className='flex items-center justify-start space-x-3'>
            {isSuccessful ? (
              <>
                <ThumbsUp size={16} /> <p>Health Check Passed</p>
              </>
            ) : (
              <>
                <ThumbsDown size={16} /> <p>Health Check Failed</p>
              </>
            )}
          </div>
          <a
            href={data.url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline hidden sm:block'
          >
            {data.url}
          </a>
        </div>
        <div className='p-1.5 space-y-2'>
          <p>
            The site returned a <strong>{data.status}</strong> status.
          </p>
          <p className='italic font-medium'>{httpStatusCodes[data.status]}</p>
          {data.location && (
            <p>
              Redirection location:{' '}
              <a
                href={data.location}
                target='_blank'
                rel='noopener noreferrer'
                className='underline'
              >
                {data.location}
                </a>
            </p>
          )}
          {data.error && (
            <p className='text-red-600'>Error: {data.error}</p>
          )}
          {data.browserInfo && (
            <p>Browser: {data.browserInfo.name} {data.browserInfo.version}</p>
          )}
          <div
            className={cn('p-3 rounded font-medium', {
              'bg-green-200': isSuccessful,
              'bg-red-200': !isSuccessful,
            })}
          >
            <pre className='whitespace-pre-wrap break-words'>
              <code>{formattedJSON}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}