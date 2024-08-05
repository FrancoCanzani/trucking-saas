import { Website } from '@/lib/types';


export default function WebsitesHealthCount({ websites }: {websites: Website[]}) {
  const stats = websites.reduce(
    (acc, website) => {
      const lastCheck = website.healthChecks[website.healthChecks.length - 1];
      if (lastCheck) {
        if (lastCheck.status === 200) {
          acc.passing += 1;
        } else {
          acc.failing += 1;
        }
      } else {
        acc.noChecks += 1;
      }
      return acc;
    },
    { passing: 0, failing: 0, noChecks: 0 }
  );

  return (
    <div className="flex space-x-4 text-sm">
      <div className="bg-green-50 border border-green-100 hover:border-green-200 p-1.5 rounded-sm w-28">
        <h4 className="font-semibold text-green-600">Passing</h4>
        <p className="font-bold text-green-700">{stats.passing}</p>
      </div>
      <div className="bg-red-50 border border-red-100 hover:border-red-200 p-1.5 rounded-sm w-28">
        <h4 className="font-semibold text-red-600">Failing</h4>
        <p className="font-bold text-red-700">{stats.failing}</p>
      </div>
      <div className="bg-gray-50 border border-gray-100 hover:border-gray-200 p-1.5 rounded-sm w-28">
        <h4 className="font-semibold text-gray-600">No Checks</h4>
        <p className="font-bold text-gray-700">{stats.noChecks}</p>
      </div>
    </div>
  );
};

