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
} from "@/components/ui/tooltip"

export default async function MonitoringOverview({ website }: { website: Website | undefined }) {
  if (!website) return null;

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
              <div className='hidden sm:block space-y-2'>
                <CardTitle>Overview</CardTitle>
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <CardDescription className='underline'>{website.url}</CardDescription>
                  </TooltipTrigger>
                  {
                    data && <TooltipContent>
                    {data.valid ? <p>{`Valid SSL certificate - Expires in ${data.daysRemaining} days`}</p> : <p className='text-red-500'>{`Invalid SSL certificate`}</p> }
                  </TooltipContent>
                  }
                </Tooltip>
              </TooltipProvider>
              </div>
              <CheckWebsiteButton website={website}>Check now</CheckWebsiteButton>
            </CardHeader>
            <CardContent>
              <ResponseTimeChart healthChecks={website.healthChecks} />
              <p>{data && data.daysRemaining}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
