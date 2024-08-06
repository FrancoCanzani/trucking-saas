import Dashboard from '@/components/dashboard';
import { sql } from '@vercel/postgres';
import { auth } from '@clerk/nextjs/server';
import { Website } from '@/lib/types';

export const maxDuration = 300

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
      hc.checked_at
    FROM 
      websites w
    LEFT JOIN 
      health_checks hc
    ON 
      w.id = hc.website_id
    WHERE 
      w.user_id = ${userId}
    ORDER BY 
      w.created_at ASC
  `;

  const websites: Website[] = [];

  rows.forEach((row) => {
    const existingWebsite = websites.find((w) => w.id === row.website_id);
    if (!existingWebsite) {
      websites.push({
        id: row.website_id,
        user_id: row.user_id,
        url: row.url,
        check_interval: row.check_interval,
        notify_email: row.notify_email,
        created_at: row.website_created_at,
        updated_at: row.website_updated_at,
        healthChecks: row.health_check_id
          ? [
              {
                id: row.health_check_id,
                status: row.status,
                response_time: row.response_time,
                checked_at: row.checked_at,
              },
            ]
          : [],
      });
    } else if (row.health_check_id) {
      existingWebsite.healthChecks.push({
        id: row.health_check_id,
        status: row.status,
        response_time: row.response_time,
        checked_at: row.checked_at,
      });
    }
  });

  return <Dashboard websites={websites} />;
}
