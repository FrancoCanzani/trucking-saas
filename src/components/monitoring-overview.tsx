import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Website } from '@/lib/types';
import Header from './header';
import ResponseTimeChart from './charts/response-time-chart';

export default function MonitoringOverview({website}:{website:Website}) {
    console.log(website.healthChecks);
    
    return(
        <div className='flex min-h-screen w-full flex-col'>
        <div className='flex flex-col sm:gap-4 sm:py-4'>            
            <Header/>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <Card x-chunk='dashboard-06-chunk-0'>
                  <CardHeader className='flex flex-row items-end justify-between w-full'>
                    <div className='hidden sm:block space-y-2'>                    
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      {website.url}
                    </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponseTimeChart healthChecks={website.healthChecks}/>
                  </CardContent>
            </Card>
        </main>
        </div>
        </div>
    )
}