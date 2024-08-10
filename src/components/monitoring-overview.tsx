import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Website } from '@/lib/types';
import Header from './header';
import ResponseTimeChart from './charts/response-time-chart';
import CheckWebsiteButton from './check-website-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default async function MonitoringOverview({
  website,
}: {
  website: Website | undefined;
}) {
  if (!website) return null;

  console.log(website);

  const host = new URL(website.url).hostname;

  let data;

  try {
    const response = await fetch(
      `${process.env.URL}/api/sslCheck?host=${encodeURIComponent(host)}`
    );

    if (response.ok) {
      data = await response.json();
    }
  } catch (error) {
    console.error('Error fetching SSL data:', error);
  }

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className='flex flex-col sm:gap-4 sm:py-4'>
        <Header />
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader className='flex flex-row items-end justify-between w-full'>
              <div className='hidden sm:block space-y-2 w-full'>
                <div className='w-full flex items-center justify-between'>
                  <CardTitle>Overview</CardTitle>{' '}
                  <div>
                    {website.healthChecks[website.healthChecks.length - 1] &&
                    website.healthChecks[website.healthChecks.length - 1]
                      .status < 300 ? (
                      <div className='flex items-center justify-end'>
                        <div className='mr-2'>
                          <span className='relative flex h-2 w-2'>
                            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75 duration-[2000ms]'></span>
                            <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500'></span>
                          </span>
                        </div>
                        <span className='font-medium text-sm'>Operational</span>
                      </div>
                    ) : (
                      <div className='flex items-center justify-end space-x-2'>
                        <div className='mr-1'>
                          <span className='relative flex h-2 w-2'>
                            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 duration-[2000ms]'></span>
                            <span className='relative inline-flex h-2 w-2 rounded-full bg-red-500'></span>
                          </span>
                        </div>
                        <span className='font-medium text-sm'>Failing</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className='w-full flex items-center justify-between'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardDescription className='underline'>
                          {website.url}
                        </CardDescription>
                      </TooltipTrigger>
                      {data && (
                        <TooltipContent>
                          {data.valid ? (
                            <p>{`Valid SSL certificate - Expires in ${data.daysRemaining} days`}</p>
                          ) : (
                            <p className='text-red-500'>{`Invalid SSL certificate`}</p>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <CheckWebsiteButton
                    website={website}
                    className='text-xs hover:underline font-medium'
                  >
                    Check now
                  </CheckWebsiteButton>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponseTimeChart healthChecks={website.healthChecks} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
