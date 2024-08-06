import { NextRequest, NextResponse } from 'next/server';
import { PageSpeedData, FormattedPageSpeedData } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const strategy = searchParams.get('strategy') || 'both'; // 'both' to handle both mobile and desktop

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.SPEED_INSIGHTS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'SPEED_INSIGHTS_API_KEY environment variable is not set' },
      { status: 500 }
    );
  }

  async function getPageSpeedInfo(
    url: string,
    strategy: string
  ): Promise<PageSpeedData> {
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&key=${apiKey}&strategy=${strategy}`;

    const response = await fetch(pageSpeedUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch PageSpeed Insights data: ${response.statusText}`);
    }

    const data: PageSpeedData = await response.json();

    if (!data.lighthouseResult) {
      throw new Error('Invalid response from PageSpeed Insights API');
    }

    return data;
  }

  function formatPageSpeedData(
    data: PageSpeedData,
    deviceType: string
  ): FormattedPageSpeedData {
    const { lighthouseResult } = data;

    return {
      timestamp: new Date().toISOString(),
      device: deviceType,
      performanceScore: Math.round(lighthouseResult.categories.performance.score * 100),
      labMetrics: {
        firstContentfulPaint: Math.round(lighthouseResult.audits['first-contentful-paint'].numericValue), // ms
        largestContentfulPaint: Math.round(lighthouseResult.audits['largest-contentful-paint'].numericValue), // ms
        cumulativeLayoutShift: parseFloat(lighthouseResult.audits['cumulative-layout-shift'].numericValue.toFixed(3)), // unitless
        interactive: Math.round(lighthouseResult.audits['interactive'].numericValue), // ms
        totalBlockingTime: Math.round(lighthouseResult.audits['total-blocking-time'].numericValue), // ms
        speedIndex: Math.round(lighthouseResult.audits['speed-index'].numericValue), // ms
      },
    };
  }

  // Type guard to check if an error is an instance of Error
  function isError(error: unknown): error is Error {
    return error instanceof Error;
  }

  try {
    const results: { [key: string]: FormattedPageSpeedData } = {};

    if (strategy === 'both' || strategy === 'desktop') {
      const desktopData = await getPageSpeedInfo(url, 'desktop');
      results.desktop = formatPageSpeedData(desktopData, 'desktop');
    }

    if (strategy === 'both' || strategy === 'mobile') {
      const mobileData = await getPageSpeedInfo(url, 'mobile');
      results.mobile = formatPageSpeedData(mobileData, 'mobile');
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching PageSpeed Insights:', error);

    const errorMessage = isError(error) ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { error: `Failed to fetch PageSpeed Insights: ${errorMessage}` },
      { status: 500 }
    );
  }
}
