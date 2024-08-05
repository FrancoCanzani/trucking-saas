import { Website } from '@/lib/types';
import CheckWebsiteButton from '@/components/check-website-button';
import { formatDistance } from 'date-fns';

export default function DashboardTableMobileView({
  websites,
}: {
  websites: Website[];
}) {
  return (
    <div className='sm:hidden space-y-4'>
      {websites.map((website) => (
        <div
          key={website.id}
          className='bg-white space-y-1 py-2 px-2.5 rounded-sm border hover:shadow'
        >
          <div className='flex items-center justify-start space-x-1'>
            <div
              className={`h-2 min-w-2 rounded-full ${
                website.healthChecks.slice(-1)[0] &&
                website.healthChecks.slice(-1)[0].status > 200
                  ? 'bg-red-600'
                  : website.healthChecks.slice(-1)[0] &&
                    website.healthChecks.slice(-1)[0].status <= 200
                  ? 'bg-green-400'
                  : 'bg-gray-400'
              }`}
            ></div>
            <h3
              className='font-medium truncate overflow-ellipsis max-w-[18rem]'
              title={website.url}
            >
              {website.url}
            </h3>
          </div>
          <p className='text-sm text-gray-600'>
            Status:{' '}
            {website.healthChecks.length > 0
              ? website.healthChecks[website.healthChecks.length - 1].status ===
                200
                ? 'Passing'
                : 'Failing'
              : 'No checks'}
            {website.healthChecks.length > 0 &&
            website.healthChecks[website.healthChecks.length - 1].checked_at
              ? ` - ${formatDistance(
                  new Date(
                    website.healthChecks[
                      website.healthChecks.length - 1
                    ].checked_at
                  ),
                  new Date(),
                  { addSuffix: true }
                )}`
              : ''}
          </p>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600'>
              Check Interval: {website.check_interval} days
            </p>
            <CheckWebsiteButton website={website} />
          </div>
        </div>
      ))}
    </div>
  );
}
