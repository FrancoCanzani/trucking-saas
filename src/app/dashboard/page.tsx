import Dashboard from '@/components/dashboard';
import { sql } from '@vercel/postgres';
import { auth } from '@clerk/nextjs/server';
import { Website } from '@/lib/types';
import { calculatePercentiles } from '@/lib/utils';

export const maxDuration = 60;

export default async function Websites() {
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
    ORDER BY 
      w.created_at DESC, hc.checked_at ASC
  `;

  const websites: Website[] = [];

  rows.forEach((row) => {
    let existingWebsite = websites.find((w) => w.id === row.website_id);
    
    if (!existingWebsite) {
      existingWebsite = {
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
        }
      };
      websites.push(existingWebsite);
    }

    if (row.health_check_id) {
      existingWebsite.healthChecks.push({
        id: row.health_check_id,
        status: row.status,
        response_time: row.response_time,
        checked_at: row.health_check_checked_at,
      });
    }
  });

  websites.forEach(website => {
    const responseTimes = website.healthChecks.map(hc => hc.response_time);
    if (responseTimes.length > 0) {
      website.percentiles = calculatePercentiles(responseTimes);
    }
  });

  
  return <Dashboard websites={websites} />;
}
