import { sql } from '@vercel/postgres';
import { auth } from '@clerk/nextjs/server';
import MonitoringOverview from '@/components/monitoring-overview';
import { Website } from '@/lib/types';

export default async function Page({ params }: { params: { id: number } }) {
  const { userId } = await auth();

  const { rows } = await sql`
    SELECT 
      w.id AS website_id,
      w.user_id,
      w.url,
      w.check_interval,
      w.notify_email,
      w.created_at AS website_created_at,
      w.updated_at AS website_updated_at,
      hc.id AS health_check_id,
      hc.status,
      hc.response_time,
      hc.checked_at AS health_check_checked_at
    FROM 
      websites w
    LEFT JOIN 
      health_checks hc ON w.id = hc.website_id
    WHERE 
      w.user_id = ${userId}
      AND
      w.id = ${params.id}
    ORDER BY 
      w.created_at DESC, hc.checked_at ASC
  `;

  let website: Website | undefined;

  rows.forEach((row) => {
    if (!website) {
      website = {
        id: row.website_id,
        user_id: row.user_id,
        url: row.url,
        check_interval: row.check_interval,
        notify_email: row.notify_email,
        created_at: row.website_created_at,
        updated_at: row.website_updated_at,
        healthChecks: [],
        percentiles: {
          p50: 0,
          p75: 0,
          p90: 0,
          p95: 0,
          p99: 0,
        },
      };
    }

    if (row.health_check_id) {
      website.healthChecks.push({
        id: row.health_check_id,
        status: row.status,
        response_time: row.response_time,
        checked_at: row.health_check_checked_at,
      });
    }
  });

  // Optional: Calculate percentiles for the response times
  if (website) {
    const responseTimes = website.healthChecks
      .map((hc) => hc.response_time)
      .sort((a, b) => a - b);
    const calculatePercentile = (percentile: number) => {
      const index = Math.ceil((percentile / 100) * responseTimes.length) - 1;
      return responseTimes[index] || 0;
    };

    website.percentiles.p50 = calculatePercentile(50);
    website.percentiles.p75 = calculatePercentile(75);
    website.percentiles.p90 = calculatePercentile(90);
    website.percentiles.p95 = calculatePercentile(95);
    website.percentiles.p99 = calculatePercentile(99);
  }

  return (
    <div>
      <MonitoringOverview website={website} />
    </div>
  );
}
