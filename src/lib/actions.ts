'use server';

import { currentUser } from '@clerk/nextjs/server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { HealthCheckResponse, Website } from './types';
import { FormattedPageSpeedData } from './types'; 

export async function createWebsiteToCheck(formData: FormData) {
  const user = await currentUser();

  const url = formData.get('url') as string;

  const userId = user?.id;
  const notifyEmail = user?.emailAddresses?.[0]?.emailAddress;

  if (!userId || !notifyEmail) {
    throw new Error('User ID or notify email is missing');
  }

  try {
    await sql`
        INSERT INTO websites (user_id, url, check_interval, notify_email)
        VALUES (${userId}, ${url}, 7, ${notifyEmail})
      `;

    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error inserting data:', error);
    throw new Error('Failed to create check');
  }
}

export async function createHealthCheck(website: Website) {
  const user = await currentUser();
  const url = website.url;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(
      `${process.env.URL}/api/healthCheck?url=${encodeURIComponent(url)}`
    );
    const data: HealthCheckResponse = await response.json();

    await sql`
      INSERT INTO health_checks (website_id, status, response_time, checked_at)
      VALUES (
        ${website.id},
        ${data.status},
        ${data.responseTime},
        NOW()
      );
    `;

    revalidatePath('/dashboard');
    return data;
  } catch (error) {
    console.error('Error performing health check or inserting data:', error);
    throw new Error('Failed to create health check');
  }
}

export async function deleteWebsite(websiteId: number) {
  const user = await currentUser();

  if (!user || !websiteId) {
    throw new Error('User is not authenticated or website ID is missing');
  }

  try {
    await sql`
      DELETE FROM health_checks WHERE website_id=${websiteId};
    `;

    await sql`
      DELETE FROM websites WHERE id=${websiteId};
    `;

    await revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error deleting website:', error);
    throw new Error('Failed to delete website');
  }
}

export async function createPageSpeedInsights(website: Website) {
  const user = await currentUser();
  const url = website.url;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(
      `${process.env.URL}/api/speedInsights?url=${encodeURIComponent(url)}&strategy=desktop`
    );
    const data: { desktop: FormattedPageSpeedData } = await response.json();

    console.log(data)
    const insights = data.desktop;

    await sql`
      INSERT INTO speed_insights (
        website_id, device, performance_score, first_contentful_paint,
        largest_contentful_paint, cumulative_layout_shift, interactive,
        total_blocking_time, speed_index, checked_at
      ) VALUES (
        ${website.id},
        'desktop',
        ${insights.performanceScore},
        ${insights.labMetrics.firstContentfulPaint},
        ${insights.labMetrics.largestContentfulPaint},
        ${insights.labMetrics.cumulativeLayoutShift},
        ${insights.labMetrics.interactive},
        ${insights.labMetrics.totalBlockingTime},
        ${insights.labMetrics.speedIndex},
        ${new Date(insights.timestamp).toISOString()}
      );
    `;

    revalidatePath('/dashboard'); 
  } catch (error) {
    console.error('Error fetching PageSpeed Insights or inserting data:', error);
    throw new Error('Failed to create PageSpeed Insights');
  }
}