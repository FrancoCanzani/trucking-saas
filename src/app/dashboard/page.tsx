import Dashboard from '@/components/dashboard';
import { sql } from '@vercel/postgres';
import { auth } from '@clerk/nextjs/server';
import { Website } from '@/lib/types';

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
      hc.checked_at AS health_check_checked_at,
      si.id AS speed_insight_id,
      si.device,
      si.performance_score,
      si.first_contentful_paint,
      si.largest_contentful_paint,
      si.cumulative_layout_shift,
      si.interactive,
      si.total_blocking_time,
      si.speed_index,
      si.checked_at AS speed_insight_checked_at
    FROM 
      websites w
    LEFT JOIN 
      health_checks hc ON w.id = hc.website_id
    LEFT JOIN
      speed_insights si ON w.id = si.website_id
      AND si.checked_at = (
        SELECT MAX(checked_at) 
        FROM speed_insights 
        WHERE website_id = w.id
      )
    WHERE 
      w.user_id = ${userId}
    ORDER BY 
      w.created_at ASC, hc.checked_at ASC
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
                checked_at: row.health_check_checked_at,
              },
            ]
          : [],
        speedInsights: row.speed_insight_id
          ? [
              {
                id: row.speed_insight_id,
                device: row.device,
                performanceScore: row.performance_score,
                labMetrics: {
                  firstContentfulPaint: row.first_contentful_paint,
                  largestContentfulPaint: row.largest_contentful_paint,
                  cumulativeLayoutShift: row.cumulative_layout_shift,
                  interactive: row.interactive,
                  totalBlockingTime: row.total_blocking_time,
                  speedIndex: row.speed_index,
                },
                checkedAt: row.speed_insight_checked_at,
              },
            ]
          : [],
      });
    } else {
      if (row.health_check_id) {
        existingWebsite.healthChecks.push({
          id: row.health_check_id,
          status: row.status,
          response_time: row.response_time,
          checked_at: row.health_check_checked_at,
        });
      }
      
      if (row.speed_insight_id) {
        existingWebsite.speedInsights = [
          {
            id: row.speed_insight_id,
            device: row.device,
            performanceScore: row.performance_score,
            labMetrics: {
              firstContentfulPaint: row.first_contentful_paint,
              largestContentfulPaint: row.largest_contentful_paint,
              cumulativeLayoutShift: row.cumulative_layout_shift,
              interactive: row.interactive,
              totalBlockingTime: row.total_blocking_time,
              speedIndex: row.speed_index,
            },
            checkedAt: row.speed_insight_checked_at,
          },
        ];
      }
    }
  });
  
  return <Dashboard websites={websites} />;
}
