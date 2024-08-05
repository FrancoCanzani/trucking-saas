'use client';

import { useUser } from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import CreateCheckForm from '@/components/create-check-form';
import { Website } from '@/lib/types';
import { columns } from '@/app/dashboard/columns';
import DasboardTable from './dashboard-table';
import {
  SignOutButton,
} from '@clerk/nextjs';
import WebsitesHealthCount from './website-health-count';

export default function Dashboard({ websites }: { websites: Website[] }) {
  const { isSignedIn, user } = useUser();
console.log(websites[0].healthChecks)
  return (
    <TooltipProvider>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <div className='flex flex-col sm:gap-4 sm:py-4'>
          <header className='sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <SignOutButton />
            {isSignedIn && (
              <p className='font-medium'>Hello, {user.firstName} 👋</p>
            )}
          </header>
          <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <Tabs defaultValue='all'>
              <div className='flex items-center justify-between'>
                <TabsList>
                  <TabsTrigger value='all'>All</TabsTrigger>
                  <TabsTrigger value='active'>Active</TabsTrigger>
                  <TabsTrigger value='draft'>Draft</TabsTrigger>
                </TabsList>
                <CreateCheckForm />
              </div>
              <TabsContent value='all'>
                <Card x-chunk='dashboard-06-chunk-0'>
                  <CardHeader className='flex flex-row items-end justify-between w-full'>
                    <div>                    
                    <CardTitle>Websites</CardTitle>
                    <CardDescription>
                      Manage your products and view their uptime.
                    </CardDescription>
                    </div>
                    <WebsitesHealthCount websites={websites}/>
                  </CardHeader>
                  <CardContent>
                    <DasboardTable columns={columns} data={websites} />
                  </CardContent>
                  <CardFooter>
                    <div className='text-xs text-muted-foreground'>
                      Showing <strong>1-10</strong> of <strong>32</strong>{' '}
                      products
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
